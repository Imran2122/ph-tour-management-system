/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../module/user/user.model";
import { IsActive, Role } from "../module/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import AppError from "../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done(null, false, {
            message: "user does not exist",
          });
        }

        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          // throw new AppError(
          //   StatusCodes.BAD_REQUEST,
          //   `User is ${isUserExist.isActive}`,
          // );
          return done(`user is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
          // throw new AppError(StatusCodes.BAD_REQUEST, "user already isDeleted");
          return done("user already isDeleted");
        }

        if (!isUserExist.isVerified) {
          // throw new AppError(StatusCodes.BAD_REQUEST, "user is not Verified");
          return done("user is not Verified");
        }

        const isGoogleAuthenticate = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == "google",
        );

        if (isGoogleAuthenticate) {
          return done(null, false, {
            message:
              "You are authenticate with google so you want to login with credentials,then at first with google and set a password your email and you can login with email and password",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string,
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "password no match" });
        }
        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No Email Found" });
        }

        // user
        let isUserExist = await User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
          // done("User is not verified")
          return done(null, false, { message: "User is not verified" });
        }

        if (
          isUserExist &&
          (isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.INACTIVE)
        ) {
          // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
          done(`User is ${isUserExist.isActive}`);
        }

        if (isUserExist && isUserExist.isDeleted) {
          return done(null, false, { message: "User is deleted" });
          // done("User is deleted")
        }

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, isUserExist);
      } catch (error) {
        //
        console.log("google error", error);
        return done(error);
      }
    },
  ),
);

//

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

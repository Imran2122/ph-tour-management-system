import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";
import httpStatus, { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelper/AppError";
import { setAuthCookies } from "../../utils/setCookies";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
const credentialsLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
         return next(new AppError(401, err))
      }

      if (!user) {
          return next(new AppError(401, info.message))
      }

      const userToken = createUserToken(user);
      const { password:pass, ...rest } = user.toObject();

      setAuthCookies(res, userToken);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user Login  Successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
    // const loginInfo = await AuthServices.credentialsLogin(req.body);

    // setAuthCookies(res, loginInfo);

    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "user Login  Successfully",
    //   data: loginInfo,
    // });
  },
);

// access token
const getNewAccessToken = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "no refresh token receive from cookies",
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string,
    );

    setAuthCookies(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "New Access Token Retrived Successfully",
      data: tokenInfo,
    });
  },
);

// logout
const logout = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "logout user Successfully",
      data: null,
    });
  },
);

// resetPassword

const resetPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "password change successfully",
      data: null,
    });
  },
);

const googleCallback = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    console.log("user", user);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "user not found");
    }
    const tokenInfo = createUserToken(user);

    setAuthCookies(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  },
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallback,
};

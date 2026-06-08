/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateToken, verifyToken } from "./../../utils/jwt";
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
  createAccessTokenWIthRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  //
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "user password not match");
  }
  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };
  // const accessToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_ACCESS_SECRET,
  //   envVars.JWT_ACCESS_EXPIRES,
  // );

  // const refreshToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_REFRESH_SECRET,
  //   envVars.JWT_REFRESH_EXPIRES,
  // );

  const userToken = createUserToken(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

// token
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenWIthRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

// ResetPAssword
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPassword = await bcryptjs.compare(
    oldPassword,
    user!.password as string,
  );
  if (!isOldPassword) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old Password does not match");
  }
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  user!.save();
  
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword
};

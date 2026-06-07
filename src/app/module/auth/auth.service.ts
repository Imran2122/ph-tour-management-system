import { generateToken } from './../../utils/jwt';
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  //
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "user already Exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "user password not match");
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};

import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../module/user/user.model";
import { StatusCodes } from "http-status-codes";
import { IsActive } from "../module/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "no Token received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;

// new 

const isUserExist = await User.findOne({ email: verifiedToken.email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "user already Exist");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User is ${isUserExist.isActive}`,
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "user already isDeleted");
  }

  if(!isUserExist.isVerified){
    throw new AppError(StatusCodes.BAD_REQUEST, "user is not Verified");
  }



      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          "You are not permitted to access this services",
        );
      }
      req.user = verifiedToken;

      console.log(verifiedToken);
      next();
    } catch (error) {
      next(error);
      //
    }
  };

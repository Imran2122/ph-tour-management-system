import { verifyToken } from "./../../utils/jwt";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

// create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

// update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const verifiedToken = req.user as JwtPayload;
  const payload = req.body;

  const user = await UserServices.updateUser(userId, payload, verifiedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Updated successfully",
    data: user,
  });
});

// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
};
// controller ar kaj only req response

// route matching -->>controller -->>service -->>model -->>DB

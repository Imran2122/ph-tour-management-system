/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { json, success } from "zod";
import { sendResponse } from "../../utils/sendResponse";

// const createUserFunction=async(req: Request, res: Response,)=>{
//  const user = await UserServices.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User Created successfully",
//       user,
//     })
// }
// type AsyncHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => Promise<void>;

// const catchAsync =
//   (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err) => {
//       console.log(err);
//       next(err);
//     });
//   };

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // createUserFunction(req, res);
//     // const user = await UserServices.createUser(req.body);
//     // res.status(httpStatus.CREATED).json({
//     //   message: "User Created successfully",
//     //   user,
//     // });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   message: "User Created successfully",
    //   user,
    // });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user Crete Successfully",
      data: user,
    });
  },
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "all user Get Successfully",
    //   data: users,
    // });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All user retrieved  user  Successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

export const userController = {
  createUser,
  getAllUsers,
};
// controller ar kaj only req response

// route matching -->>controller -->>service -->>model -->>DB

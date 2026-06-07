import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   message: "User Created successfully",
    //   user,
    // });

    const loginInfo = await AuthServices.credentialsLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user Login  Successfully",
      data: loginInfo,
    });
  },
);

export const AuthControllers = {
  credentialsLogin,
};

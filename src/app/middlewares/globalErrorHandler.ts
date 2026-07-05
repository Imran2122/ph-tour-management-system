/* eslint-disable prefer-const */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { TErrorSources } from "../interfaces/error.types";
import { handleDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastError";
import { handleZodError } from "../helper/handleZodError";
import { handleValidationError } from "../helper/handleValidationError";
import { deleteImageFromCLoudinary } from "../config/cloudinary.config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  // single file
  if (req.file) {
    await deleteImageFromCLoudinary(req.file.path);
  }

  // multiple files

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );
    await Promise.all(imageUrls.map((url) => deleteImageFromCLoudinary(url)));
  }

  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = `Something wrong !! ${err.message} from global error`;

  if (err.code === 11000) {
    //
    console.log("duplicate Error", err.message);
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;

    // CastError
  } else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // mongoes
  else if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as unknown as TErrorSources[];
  }
  // validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as unknown as TErrorSources[];
    message = simplifiedError.message;

    //
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 401;
    message = "validation Error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};

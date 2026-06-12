/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleZodError = (err: any): TGenericErrorResponse => {
  let errorSources: TErrorSources[] = [];
  err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zor Error",
  };
};

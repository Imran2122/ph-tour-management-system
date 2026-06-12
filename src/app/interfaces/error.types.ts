export interface TErrorSources {
  path: string |string [];
  message: string;
}

export  interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources?: TErrorSources;
}
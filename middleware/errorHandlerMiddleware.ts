import { NextFunction, Request, Response } from "express";

export function errorHandleMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.statusCode ? error.statusCode : 500;
  console.log("error middleware:", error);
  if (error.operational) {
    return res
      .status(statusCode)
      .json({ error: error.message, name: error.name });
  }

  return res
    .status(statusCode)
    .json({ error: "Something went wrong", name: error.name });
}

import type { NextFunction, Request, Response } from "express";


export const globalErrorHandler = (
  error: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
    errors: [],
  });
};
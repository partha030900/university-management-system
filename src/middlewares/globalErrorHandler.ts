import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";


export const globalErrorHandler = (
  error: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Duplicate record already exists",
      errors: [],
    });
  }
}

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
    errors: [],
  });
};
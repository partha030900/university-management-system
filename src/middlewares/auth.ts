import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { AppError } from "../utils/AppError.js";
import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}



export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError(401, "Authentication required");
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new AppError(401, "Authentication required");
  }

  try {
    const decoded = jwt.verify(token, config.jwt_access_secret);

    req.user = decoded as JwtPayload;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }
};

export {};
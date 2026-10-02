import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role as string)) {
      throw new AppError(403, "You do not have permission to perform this action");
    }

    next();
  };
};
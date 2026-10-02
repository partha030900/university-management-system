import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { prisma } from "../lib/prisma.js";

export const authorizeRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required");
  }

  // Admin can register any student
  if (req.user.role === "ADMIN") {
    return next();
  }

  // Only students can continue
  if (req.user.role !== "STUDENT") {
    throw new AppError(
      403,
      "You do not have permission to create a registration"
    );
  }

  const requestedStudentId = Number(req.body.studentId);

  const student = await prisma.student.findUnique({
    where: {
      userId: req.user.id,
    },
  });

  if (!student) {
    throw new AppError(404, "Student profile not found");
  }

  if (student.id !== requestedStudentId) {
    throw new AppError(
      403,
      "You can only create registrations for yourself"
    );
  }

  next();
};
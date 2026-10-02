import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { prisma } from "../lib/prisma.js";

export const authorizeStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required");
  }

  // Admin can access any student's data
  if (req.user.role === "ADMIN") {
    return next();
  }

  // Only students can continue from here
  if (req.user.role !== "STUDENT") {
    throw new AppError(
      403,
      "You do not have permission to access student data"
    );
  }

  const requestedStudentId = Number(req.params.studentId);

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
      "You can only access your own student data"
    );
  }

  next();
};
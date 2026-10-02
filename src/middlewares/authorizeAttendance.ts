import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { prisma } from "../lib/prisma.js";

export const authorizeAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required");
  }

  // Admin and instructor can view any attendance
  if (
    req.user.role === "ADMIN" ||
    req.user.role === "INSTRUCTOR"
  ) {
    return next();
  }

  // Only students continue from here
  if (req.user.role !== "STUDENT") {
    throw new AppError(
      403,
      "You do not have permission to access attendance"
    );
  }

  const registrationId = Number(req.params.registrationId);

  const registration = await prisma.registration.findUnique({
    where: {
      id: registrationId,
    },
    include: {
      student: true,
    },
  });

  if (!registration) {
    throw new AppError(404, "Registration not found");
  }

  if (registration.student.userId !== req.user.id) {
    throw new AppError(
      403,
      "You can only access your own attendance"
    );
  }

  next();
};
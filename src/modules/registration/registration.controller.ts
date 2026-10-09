
import type { Request, Response } from "express";
import { registrationService } from "./registration.service.js";

const createRegistration = async (req: Request, res: Response) => {
  const registration = await registrationService.createRegistration(
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Registration created successfully",
    data: registration,
  });
};

const getMyRegistrations = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new Error("Authentication required");
  }

  const registrations =
    await registrationService.getStudentRegistrations(
      req.user.id as number
    );

  res.status(200).json({
    success: true,
    message: "Registrations fetched successfully",
    data: registrations,
  });
};

export const registrationController = {
  createRegistration,getMyRegistrations
};
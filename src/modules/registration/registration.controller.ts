
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

export const registrationController = {
  createRegistration,
};
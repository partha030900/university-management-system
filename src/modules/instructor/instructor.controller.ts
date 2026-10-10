import type { Request, Response } from "express";
import { instructorService } from "./insructor.service";

const getAllInstructorsCount = async (_req: Request, res: Response) => {
  const count = await instructorService.getAllInstructorsCount();

  res.status(200).json({
    success: true,
    message: "Instructor count retrieved successfully",
    data: count,
  });
};

const getMySections = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const sections = await instructorService.getMySections(userId);

  res.status(200).json({
    success: true,
    message: "Instructor sections retrieved successfully",
    data: sections,
  });
};

const getMyStudents = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const students = await instructorService.getMyStudents(userId);

  res.status(200).json({
    success: true,
    message: "Instructor students retrieved successfully",
    data: students,
  });
};

export const instructorController = {
  getAllInstructorsCount,
  getMySections,
  getMyStudents
};
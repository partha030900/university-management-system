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

export const instructorController = {
  getAllInstructorsCount,
};
import type { Request, Response } from "express";
import { sectionService } from "./section.service.js";

const getAllSections = async (_req: Request, res: Response) => {
  const sections = await sectionService.getAllSections();

  res.status(200).json({
    success: true,
    message: "Sections retrieved successfully",
    data: sections,
  });
};

export const sectionController = {
  getAllSections,
};
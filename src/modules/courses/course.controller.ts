import type { Request, Response } from "express";
import { courseService } from "./course.service.js";

const getAllCourses = async (_req: Request, res: Response) => {
  const courses = await courseService.getAllCourses();

  res.status(200).json({
    success: true,
    message: "Courses retrieved successfully",
    data: courses,
  });
};

export const courseController = {
  getAllCourses,
};
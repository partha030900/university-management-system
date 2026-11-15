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

const createCourse = async (req: Request, res: Response) => {
  const course = await courseService.createCourse(req.body);

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
};


export const courseController = {
  getAllCourses,createCourse
};
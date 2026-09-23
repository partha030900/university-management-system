import type { Request, Response } from "express";
import { studentService } from "./student.service.js";

const createStudent = async (req: Request, res: Response) => {
  const student = await studentService.createStudent(req.body);

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: student,
  });
};

export const studentController = {
  createStudent,
};
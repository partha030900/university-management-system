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

const getStudentById = async (req: Request, res: Response) => {
  const student = await studentService.getStudentById(
    Number(req.params.id)
  );

  res.status(200).json({
    success: true,
    message: "Student retrieved successfully",
    data: student,
  });
};

export const studentController = {
  createStudent,getStudentById
};
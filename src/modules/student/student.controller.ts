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

const getAllStudents = async (_req: Request, res: Response) => {
  const students = await studentService.getAllStudents();

  res.status(200).json({
    success: true,
    message: "Students retrieved successfully",
    data: students,
  });
};

export const studentController = {
  createStudent,getStudentById,getAllStudents
};
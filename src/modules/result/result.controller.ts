
import type { Request, Response } from "express";
import { resultService } from "./result.service.js";

const getStudentResults = async (req: Request, res: Response) => {
  const studentId = Number(req.params.studentId);

  const results = await resultService.getStudentResults(studentId);

  res.status(200).json({
    success: true,
    message: "Student results retrieved successfully",
    data: results,
  });
};

const getStudentGPA = async (req: Request, res: Response) => {
  const studentId = Number(req.params.studentId);

  const gpa = await resultService.getStudentGPA(studentId);

  res.status(200).json({
    success: true,
    message: "Student GPA calculated successfully",
    data: {
      studentId,
      gpa,
    },
  });
};

const createResult = async (req: Request, res: Response) => {
  console.log("BODY:", req.body);
  const result = await resultService.createResult(req.body);

  res.status(201).json({
    success: true,
    message: "Result created successfully",
    data: result,
  });
};

export const resultController = {
  getStudentResults,
  getStudentGPA,
  createResult
};
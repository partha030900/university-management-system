
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
  const userId = Number(req.user?.id);
  const userRole = String(req.user?.role);

  if (!userId || !Number.isInteger(userId)) {
    throw new Error("Invalid user ID in authentication token");
  }

  const result = await resultService.createResult(
    req.body,
    userId,
    userRole
  );

  res.status(201).json({
    success: true,
    message: "Result created successfully",
    data: result,
  });
};

const getExamStudents = async (req: Request, res: Response) => {
  const examId = Number(req.params.examId);
  const userId = Number(req.user?.id);
  const userRole = String(req.user?.role);

  const result = await resultService.getExamStudents(
    examId,
    userId,
    userRole
  );

  res.status(200).json({
    success: true,
    message: "Exam students retrieved successfully",
    data: result,
  });
};

const getExamPerformance = async (req: Request, res: Response) => {
  const examId = Number(req.params.examId);
  const userId = Number(req.user?.id);
  const userRole = String(req.user?.role);

  const result = await resultService.getExamPerformance(
    examId,
    userId,
    userRole
  );

  res.status(200).json({
    success: true,
    message: "Exam performance retrieved successfully",
    data: result,
  });
};


export const resultController = {
  getStudentResults,
  getStudentGPA,
  getExamStudents,
  createResult,
  getExamPerformance,
};
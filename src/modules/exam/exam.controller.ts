import type { Request, Response } from "express";
import { examService } from "./exam.service.js";

const createExam = async (req: Request, res: Response) => {
  if (!req.user) {
  throw new Error("Authentication required");
}

const exam = await examService.createExam(
  req.body,
  req.user.id as number,
  req.user.role as string
);

  res.status(201).json({
    success: true,
    message: "Exam created successfully",
    data: exam,
  });
};

export const examController = {
  createExam,
};
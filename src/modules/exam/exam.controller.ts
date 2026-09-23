import type { Request, Response } from "express";
import { examService } from "./exam.service.js";

const createExam = async (req: Request, res: Response) => {
  const exam = await examService.createExam(req.body);

  res.status(201).json({
    success: true,
    message: "Exam created successfully",
    data: exam,
  });
};

export const examController = {
  createExam,
};
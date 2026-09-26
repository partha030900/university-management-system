import type { Request, Response } from "express";
import { transcriptService } from "./transcript.service.js";

const getStudentTranscript = async (req: Request, res: Response) => {
  const studentId = Number(req.params.studentId);

  const transcript = await transcriptService.getStudentTranscript(studentId);

  res.status(200).json({
    success: true,
    message: "Student transcript retrieved successfully",
    data: transcript,
  });
};

export const transcriptController = {
  getStudentTranscript,
};
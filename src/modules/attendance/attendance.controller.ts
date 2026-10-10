import type { Request, Response } from "express";
import { attendanceService } from "./attendance.service.js";

const createAttendance = async (req: Request, res: Response) => {
  const attendance = await attendanceService.createAttendance(
    req.body,
    {
      id: req.user!.id,
      role: req.user!.role as "ADMIN" | "INSTRUCTOR",
    }
  );

  res.status(201).json({
    success: true,
    message: "Attendance recorded successfully",
    data: attendance,
  });
};

const getAttendanceSummary = async (req: Request, res: Response) => {
  const registrationId = Number(req.params.registrationId);

  const summary = await attendanceService.getAttendanceSummary(
    registrationId
  );

  res.status(200).json({
    success: true,
    message: "Attendance summary retrieved successfully",
    data: summary,
  });
};

const getSectionStudents = async (req: Request, res: Response) => {
  const sectionId = Number(req.params.sectionId);

  const students = await attendanceService.getSectionStudents(
    sectionId,
    {
      id: req.user!.id,
      role: req.user!.role as "ADMIN" | "INSTRUCTOR",
    }
  );

  res.status(200).json({
    success: true,
    message: "Section students retrieved successfully",
    data: students,
  });
};

export const attendanceController = {
  createAttendance,getAttendanceSummary,getSectionStudents
};
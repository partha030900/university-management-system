import express from "express";
import { attendanceController } from "./attendance.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createAttendanceSchema } from "./attendance.validation.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(createAttendanceSchema),
  attendanceController.createAttendance
);

router.get(
  "/registration/:registrationId",
  attendanceController.getAttendanceSummary
);

export const attendanceRoutes = router;
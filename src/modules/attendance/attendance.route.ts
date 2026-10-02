import express from "express";
import { attendanceController } from "./attendance.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createAttendanceSchema } from "./attendance.validation.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { authorizeAttendance } from "../../middlewares/authorizeAttendance.js";


const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validateRequest(createAttendanceSchema),
  attendanceController.createAttendance
);

router.get(
  "/registration/:registrationId",
  authenticate,
  authorizeAttendance,
  attendanceController.getAttendanceSummary
);

export const attendanceRoutes = router;
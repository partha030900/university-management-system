import express from "express";
import { studentController } from "./student.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createStudentSchema } from "./student.validation.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(createStudentSchema),
  studentController.createStudent
);

export const studentRoutes = router;
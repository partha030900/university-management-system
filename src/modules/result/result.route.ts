import express from "express";
import { resultController } from "./result.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createResultSchema } from "./result.validation.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { authorizeStudent } from "../../middlewares/authorizeStudent.js";


const router = express.Router();

router.get(
  "/student/:studentId",
  authenticate,
  authorizeStudent,
  resultController.getStudentResults
);

router.get(
  "/student/:studentId/gpa",
  authenticate,
  authorizeStudent,
  resultController.getStudentGPA
);

router.get(
  "/exam/:examId/students",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  resultController.getExamStudents
);

router.post("/", authenticate, authorize("ADMIN", "INSTRUCTOR"), validateRequest(createResultSchema), resultController.createResult);

router.get(
  "/exam/:examId/performance",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  resultController.getExamPerformance
);


export const resultRoutes = router;
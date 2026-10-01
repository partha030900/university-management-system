import express from "express";
import { resultController } from "./result.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createResultSchema } from "./result.validation.js";
import { authenticate } from "../../middlewares/auth.js";


const router = express.Router();

router.get(
  "/student/:studentId",authenticate,
  resultController.getStudentResults
);

router.get(
  "/student/:studentId/gpa",
  resultController.getStudentGPA
);
router.post(
  "/",
  validateRequest(createResultSchema),
  resultController.createResult
);
export const resultRoutes = router;
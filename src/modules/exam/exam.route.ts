import express from "express";

import { examController } from "./exam.controller.js";

import { validateRequest } from "../../middlewares/validateRequest.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { createExamSchema } from "./exam.validation.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validateRequest(createExamSchema),
  examController.createExam
);

export const examRoutes = router;
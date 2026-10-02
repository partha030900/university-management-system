import express from "express";

import { transcriptController } from "./transcript.controller.js";

import { authenticate } from "../../middlewares/auth.js";
import { authorizeStudent } from "../../middlewares/authorizeStudent.js";

const router = express.Router();

router.get(
  "/student/:studentId",
  authenticate,
  authorizeStudent,
  transcriptController.getStudentTranscript
);

export const transcriptRoutes = router;
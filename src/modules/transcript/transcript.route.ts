import express from "express";
import { transcriptController } from "./transcript.controller.js";

const router = express.Router();

router.get(
  "/student/:studentId",
  transcriptController.getStudentTranscript
);

export const transcriptRoutes = router;
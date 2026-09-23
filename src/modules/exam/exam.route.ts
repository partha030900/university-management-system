import express from "express";
import { examController } from "./exam.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createExamSchema } from "./exam.validation.js";

const router = express.Router();

router.post( "/",validateRequest(createExamSchema),examController.createExam);

export const examRoutes = router;

import express from "express";
import { courseController } from "./course.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createCourseSchema } from "./course.validation.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router.post("/",authenticate,authorize("ADMIN"),validateRequest(createCourseSchema),courseController.createCourse);

router.get("/", courseController.getAllCourses);

export const courseRoutes = router;

import express from "express";
import { courseController } from "./course.controller.js";

const router = express.Router();

router.get("/", courseController.getAllCourses);

export const courseRoutes = router;
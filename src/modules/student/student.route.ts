import express from "express";
import { studentController } from "./student.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createStudentSchema } from "./student.validation.js";
import { authorizeStudent } from "../../middlewares/authorizeStudent.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize} from "../../middlewares/authorize.js";

const router = express.Router();

router.post("/",authenticate,authorize("ADMIN"),validateRequest(createStudentSchema),studentController.createStudent);

router.get("/:id",authenticate,authorizeStudent,studentController.getStudentById);

router.get("/",authenticate,authorize("ADMIN"),studentController.getAllStudents);

export const studentRoutes = router;
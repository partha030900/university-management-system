import express from "express";
import { studentController } from "./student.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createStudentSchema,createMyStudentProfileSchema } from "./student.validation.js";
import { authorizeStudent } from "../../middlewares/authorizeStudent.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize} from "../../middlewares/authorize.js";

const router = express.Router();

router.post("/",authenticate,authorize("ADMIN"),validateRequest(createStudentSchema),studentController.createStudent);

router.post("/my-profile",authenticate,authorize("STUDENT"),validateRequest(createMyStudentProfileSchema),
  studentController.createMyStudentProfile
);

router.get( "/my-profile",authenticate,authorize("STUDENT"),studentController.getMyStudentProfile);

router.get("/programs",authenticate,authorize("STUDENT", "ADMIN"),studentController.getAllPrograms);

router.get("/:id",authenticate,authorizeStudent,studentController.getStudentById);

router.get("/",authenticate,authorize("ADMIN"),studentController.getAllStudents);



export const studentRoutes = router;
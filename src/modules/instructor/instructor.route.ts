import express from "express";
import { instructorController } from "./instructor.controller.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

router.get(
  "/count",
  authenticate,
  authorize("ADMIN"),
  instructorController.getAllInstructorsCount
);

export const instructorRoutes = router;
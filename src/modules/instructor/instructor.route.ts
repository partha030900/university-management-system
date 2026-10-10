import { Router } from "express";
import { instructorController } from "./instructor.controller";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";


const router = Router();

router.get(
  "/count",
  authenticate,
  authorize("ADMIN"),
  instructorController.getAllInstructorsCount
);

router.get(
  "/my-sections",
  authenticate,
  authorize("INSTRUCTOR"),
  instructorController.getMySections
);

export const instructorRoutes = router;
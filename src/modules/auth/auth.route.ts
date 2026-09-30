import { Router } from "express";
import { authController } from "./auth.controller.js";
import { registerSchema } from "./auth.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);

export const authRoutes = router;
import { Router } from "express";
import { authController } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { googleLoginSchema } from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);

router.post(
  "/login",
  validateRequest(loginSchema),
  authController.login
);

router.post(
  "/refresh-token",
  authController.refreshAccessToken
);

router.post(
  "/logout",
  authController.logout
);

router.post(
  "/google",
  validateRequest(googleLoginSchema),
  authController.googleLogin
);


export const authRoutes = router;
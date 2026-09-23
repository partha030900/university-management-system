import express from "express";
import { registrationController } from "./registration.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createRegistrationSchema } from "./registration.validation.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(createRegistrationSchema),
  registrationController.createRegistration
);

export const registrationRoutes = router;
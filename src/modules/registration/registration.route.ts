import express from "express";

import { registrationController } from "./registration.controller.js";

import { validateRequest } from "../../middlewares/validateRequest.js";
import { createRegistrationSchema } from "./registration.validation.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { authorizeRegistration } from "../../middlewares/authorizeRegistration.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "STUDENT"),
  authorizeRegistration,
  validateRequest(createRegistrationSchema),
  registrationController.createRegistration
);


router.get(
  "/mine",
  authenticate,
  authorize("STUDENT"),
  registrationController.getMyRegistrations
);

export const registrationRoutes = router;
import express from "express";

import { paymentController } from "./payment.controller.js";
import { createCheckoutSessionSchema } from "./payment.validation.js";

import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

const router = express.Router();

router.post(
  "/checkout",
  authenticate,
  authorize("STUDENT"),
  validateRequest(createCheckoutSessionSchema),
  paymentController.createCheckoutSession
);

router.get(
  "/success",
  paymentController.paymentSuccess
);

export const paymentRoutes = router;
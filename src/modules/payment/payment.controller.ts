import type { Request, Response } from "express";
import { paymentService } from "./payment.service.js";
import { AppError } from "../../utils/AppError.js";
import Stripe from "stripe";
import config from "../../config/index.js";
import { stripe } from "../../lib/stripe.js";
import { prisma } from "../../lib/prisma.js";


const createCheckoutSession = async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required");
  }

  const studentId = req.user.id as number;

  const result = await paymentService.createCheckoutSession(
    studentId,
    req.body.registrationId
  );

  res.status(201).json({
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
};

const paymentSuccess = async (
  req: Request,
  res: Response
) => {
  const sessionId = req.query.session_id;

  if (typeof sessionId !== "string") {
    throw new AppError(400, "Invalid Stripe session ID");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new AppError(400, "Payment has not been completed");
  }

  const payment = await prisma.payment.findFirst({
    where: {
      stripeSessionId: session.id,
      status: "PAID",
    },
  });

  if (!payment) {
    throw new AppError(
      404,
      "Payment confirmation is still being processed"
    );
  }

  res.status(200).json({
    success: true,
    message: "Payment completed successfully",
    data: {
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      paidAt: payment.paidAt,
    },
  });
};

const stripeWebhook = async (
  req: Request,
  res: Response
) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Stripe signature is missing",
      errors: [],
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe_webhook_secret
    );
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook signature",
      errors: [],
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentId = session.metadata?.paymentId;

    if (paymentId && session.payment_status === "paid") {
  const payment = await prisma.payment.findUnique({
    where: {
      id: Number(paymentId),
    },
  });

  if (
    payment &&
    payment.stripeSessionId === session.id &&
    session.amount_total === Math.round(payment.amount * 100) &&
    session.currency === payment.currency.toLowerCase() &&
    payment.status === "PENDING"
  ) {
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });
  }
}
  }

  res.status(200).json({
    success: true,
    message: "Webhook processed successfully",
    data: {},
  });
};

export const paymentController = {
  createCheckoutSession,paymentSuccess,stripeWebhook
};
import { prisma } from "../../lib/prisma.js";
import { stripe } from "../../lib/stripe.js";
import { AppError } from "../../utils/AppError.js";

const createCheckoutSession = async (
  studentId: number,
  registrationId: number
) => {
  const registration = await prisma.registration.findUnique({
    where: {
      id: registrationId,
    },
    include: {
      student: true,
      section: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!registration) {
    throw new AppError(404, "Registration not found");
  }

  if (registration.student.userId !== studentId) {
  throw new AppError(
    403,
    "You can only pay for your own registration"
  );
}

  const existingPayment = await prisma.payment.findFirst({
    where: {
      registrationId,
      status: "PAID",
    },
  });

  if (existingPayment) {
    throw new AppError(
      409,
      "This registration has already been paid"
    );
  }

  const amount = 100;

  const payment = await prisma.payment.create({
    data: {
      registrationId,
      amount,
      currency: "usd",
      status: "PENDING",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: registration.section.course.title,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],

   success_url:
  "https://university-management-system-liart.vercel.app/api/v1/payments/success?session_id={CHECKOUT_SESSION_ID}",

cancel_url:
  "https://university-management-system-liart.vercel.app/api/v1/payments/cancel",

    metadata: {
      paymentId: payment.id.toString(),
      registrationId: registrationId.toString(),
    },
  });

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      stripeSessionId: session.id,
    },
  });

  return {
    paymentId: payment.id,
    checkoutUrl: session.url,
  };
};

export const paymentService = {
  createCheckoutSession,
};
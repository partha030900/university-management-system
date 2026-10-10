import express, { type Application, type Request, type Response } from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import { resultRoutes } from "./modules/result/result.route.js";
import { registrationRoutes } from "./modules/registration/registration.route.js";
import { studentRoutes } from "./modules/student/student.route.js";
import { examRoutes } from "./modules/exam/exam.route.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { attendanceRoutes } from "./modules/attendance/attendance.route.js";
import { transcriptRoutes } from "./modules/transcript/transcript.route.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import { paymentRoutes } from "./modules/payment/payment.route.js";
import { paymentController } from "./modules/payment/payment.controller.js";
import { courseRoutes } from "./modules/courses/course.route.js";
import { sectionRoutes } from "./modules/section/section.route.js";
import { instructorRoutes } from "./modules/instructor/instructor.route.js";



const app: Application = express();

app.use(cors({
    origin: [
      "http://localhost:3000",
      "https://university-management-frontend.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "University Management System API",
  });
});

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "University Management System API is running",
  });
});

app.use("/api/v1/results", resultRoutes);

app.use("/api/v1/registrations", registrationRoutes);

app.use("/api/v1/students", studentRoutes);

app.use("/api/v1/exams", examRoutes);

app.use("/api/v1/attendance", attendanceRoutes);

app.use("/api/v1/transcript", transcriptRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/payments", paymentRoutes);

app.use("/api/v1/courses", courseRoutes);

app.use("/api/v1/sections", sectionRoutes);

app.use("/api/v1/instructors", instructorRoutes);

app.use(globalErrorHandler);








export default app;
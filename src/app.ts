import express, { type Application, type Request, type Response } from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import { resultRoutes } from "./modules/result/result.route.js";


const app: Application = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "University Management System API is running",
  });
});

app.use("/api/v1/results", resultRoutes);








export default app;
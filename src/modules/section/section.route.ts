import express from "express";
import { sectionController } from "./section.controller.js";
import { authenticate } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, sectionController.getAllSections);

export const sectionRoutes = router;
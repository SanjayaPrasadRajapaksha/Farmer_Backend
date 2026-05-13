import express from "express";
import DailyEmailController from "../controllers/daily_email.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/sendCustomerReport", upload.single("report"), DailyEmailController.sendCustomerReport);

export default router;

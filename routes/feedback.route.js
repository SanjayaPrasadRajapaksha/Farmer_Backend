import express from "express";
import FeedbackController from "../controllers/feedback.controller.js";
//import { authenticateJWT, authorizeRoleNames } from "../middleware/auth.js";

const router = express.Router();
router.post("/create", FeedbackController.create);
router.delete("/deleteById/:id", FeedbackController.deleteById);
router.get("/getAll", FeedbackController.getAll);
router.get("/getById/:id", FeedbackController.findById);
router.put("/verifyById/:id", FeedbackController.verifyById);

export default router;
import express from "express";
import FaqController from "../controllers/faq.controller.js";

const router = express.Router();

router.post("/create", FaqController.create);
router.put("/updateById/:id", FaqController.updateById);
router.get("/getAll", FaqController.getAll);
router.get("/getById/:id", FaqController.findById);
router.delete("/deleteById/:id", FaqController.deleteById);

export default router;

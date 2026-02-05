import express from "express";
import Price_TypeController from "../controllers/price_type.controller.js";

const router = express.Router();
router.post("/create", Price_TypeController.create);
router.put("/updateById/:id", Price_TypeController.updateById);
router.get("/getAll", Price_TypeController.getAll);
router.get("/getById/:id", Price_TypeController.findById);
router.delete("/deleteById/:id", Price_TypeController.deleteById);

export default router;
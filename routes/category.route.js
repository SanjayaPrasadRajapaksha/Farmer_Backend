import express from "express";
import CategoryController from "../controllers/category.controller.js";

const router = express.Router();
router.post("/create", CategoryController.create);
router.put("/updateById/:id", CategoryController.updateById);
router.get("/getAll", CategoryController.getAll);
router.get("/getById/:id", CategoryController.findById);
router.delete("/deleteById/:id", CategoryController.deleteById);

export default router;
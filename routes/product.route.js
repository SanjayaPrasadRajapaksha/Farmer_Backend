import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();
router.post("/create", ProductController.create);
router.put("/updateById/:id", ProductController.updateById);
router.get("/getAll", ProductController.getAll);
router.get("/getById/:id", ProductController.findById);
router.delete("/deleteById/:id", ProductController.deleteById);

export default router;
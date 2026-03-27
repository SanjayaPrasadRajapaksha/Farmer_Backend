import express from "express";
import ProductController from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.post("/create", ProductController.create);
router.put("/updateById/:id", ProductController.updateById);
router.put("/uploadImage/:id", upload.single("image"), ProductController.uploadImage);
router.post("/uploadImage/:id", upload.single("image"), ProductController.uploadImage);
router.get("/getAll", ProductController.getAll);
router.get("/getById/:id", ProductController.findById);
router.delete("/deleteById/:id", ProductController.deleteById);

export default router;
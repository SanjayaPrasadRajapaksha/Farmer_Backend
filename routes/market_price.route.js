import express from "express"
import upload from "../config/multer.config.js"
import MarketPriceController from "../controllers/market_price.controller.js"

const router = express.Router()

router.post("/create", MarketPriceController.create);
router.put("/updateById/:id", MarketPriceController.updateById);
router.get("/getAll", MarketPriceController.getAll);
router.get("/getById/:id", MarketPriceController.findById);
router.delete("/deleteById/:id", MarketPriceController.deleteById);
router.put("/verifyById/:id", MarketPriceController.verifyById);
router.post("/upload",upload.single("pdf"),MarketPriceController.uploadMarketPricesFromPDF);

export default router

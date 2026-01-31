import express from "express"
import upload from "../config/multer.config.js"
import MarketPriceController from "../controllers/market_price.controller.js"

const router = express.Router()

router.post(
  "/upload",
  upload.single("pdf"),
  MarketPriceController.uploadMarketPricesFromPDF
)

export default router

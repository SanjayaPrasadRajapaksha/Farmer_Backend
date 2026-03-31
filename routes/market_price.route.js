import express from "express"
import upload from "../config/multer.config.js"
import MarketPriceController from "../controllers/market_price.controller.js"

const router = express.Router()

router.post("/upload_dambulla",upload.single("pdf"),MarketPriceController.uploadDambullaMarketPricesFromPDF);
router.post("/upload_tambuttegama",upload.single("pdf"),MarketPriceController.uploadTambuttegamaMarketPricesFromPDF);
router.post("/create", MarketPriceController.create);
router.put("/updateById/:id", MarketPriceController.updateById);
router.get("/getAll", MarketPriceController.getAll);
router.get("/getById/:id", MarketPriceController.findById);
router.delete("/deleteById/:id", MarketPriceController.deleteById);
router.put("/verifyById/:id", MarketPriceController.verifyById);
router.put("/verifyAll", MarketPriceController.verifyAll);


export default router

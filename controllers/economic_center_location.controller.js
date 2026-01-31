import MarketPriceService from "../services/market_price.service.js"

class MarketPriceController {
  static async uploadMarketPricesFromPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" })
      }

      const result = await MarketPriceService.processPDF(req.file.path)

      res.status(201).json({
        success: true,
        message: "Market prices extracted successfully",
        insertedRecords: result.count
      })
    } catch (err) {
      console.error("Controller Error:", err)
      res.status(500).json({ error: err.message })
    }
  }
}

export default MarketPriceController

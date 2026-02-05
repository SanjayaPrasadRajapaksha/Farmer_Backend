import MarketPriceService from "../services/market_price.service.js"

const MarketPriceController = {
  async create(req, res) {
    try {
      const { price, Date: date, economic_center_location_id, price_type_id, product_id, isVerify } = req.body
      const result = await MarketPriceService.create(
        price,
        date,
        economic_center_location_id,
        price_type_id,
        product_id,
        isVerify
      )

      if (result.status) {
        return res.status(201).json({
          response_code: 200,
          status: true,
          message: "Market price added successfully!",
          result: result.result,
        })
      }

      return res.status(400).json({
        response_code: 400,
        status: false,
        message: result.message,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        response_code: 500,
        status: false,
        message: "Error occurred while saving Market Price!",
      })
    }
  },

  async getAll(req, res) {
    try {
      const result = await MarketPriceService.getAll()
      if (!result) {
        return res.status(404).json({ response_code: 404, status: false, message: "Market prices not found!" })
      }
      return res.status(200).json({
        response_code: 200,
        status: true,
        message: "Market prices fetched successfully!",
        result,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ response_code: 500, status: false, message: "Error occurred while fetching Market prices!" })
    }
  },

  async findById(req, res) {
    const id = req.params.id
    try {
      const result = await MarketPriceService.findById(id)
      if (!result) {
        return res.status(404).json({ response_code: 404, status: false, message: "Market price not found!" })
      }
      return res.status(200).json({
        response_code: 200,
        status: true,
        message: "Market price fetched successfully!",
        result,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ response_code: 500, status: false, message: "Error occurred while fetching Market price!" })
    }
  },

  async updateById(req, res) {
    const id = req.params.id
    const { price, Date: date, economic_center_location_id, price_type_id, product_id, isVerify } = req.body
    try {
      const result = await MarketPriceService.updateById(id, {
        price,
        Date: date,
        economic_center_location_id,
        price_type_id,
        product_id,
        isVerify,
      })

      if (result == 0) {
        return res.status(404).json({ response_code: 404, status: false, message: "Market price not found!" })
      }

      return res.status(200).json({
        response_code: 200,
        status: true,
        message: "Market price updated successfully!",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ response_code: 500, status: false, message: "Error occurred while updating Market price!" })
    }
  },

  async verifyById(req, res) {
    const id = req.params.id
    const { isVerify } = req.body
    try {
      const result = await MarketPriceService.verifyById(id, isVerify)
      if (result == 0) {
        return res.status(404).json({ response_code: 404, status: false, message: "Market price not found!" })
      }
      return res.status(200).json({
        response_code: 200,
        status: true,
        message: "Market price verified successfully!",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ response_code: 500, status: false, message: "Error occurred while verifying Market price!" })
    }
  },

  async deleteById(req, res) {
    const id = req.params.id
    try {
      const result = await MarketPriceService.deleteById(id)
      if (result == 1) {
        return res.status(200).json({ response_code: 200, status: true, message: "Market price deleted successfully!" })
      }
      return res.status(404).json({ response_code: 404, status: false, message: "Market price not found!" })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ response_code: 500, status: false, message: "Error occurred while deleting Market price!" })
    }
  },

  async uploadMarketPricesFromPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" })
      }

      const result = await MarketPriceService.processPDF(req.file)

      return res.status(201).json({
        success: true,
        message: "Market prices extracted successfully",
        insertedRecords: result.count,
        parseMeta: result.meta
      })
    } catch (err) {
      console.error("Controller Error:", err)
      return res.status(500).json({ error: err.message })
    }
  }
}

export default MarketPriceController

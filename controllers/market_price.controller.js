import MarketPriceService from "../services/market_price.service.js"

const MarketPriceController = {
  
  async uploadDambullaMarketPricesFromPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" })
      }

      const result = await MarketPriceService.processDambullaPDF(req.file)

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
  },
  async uploadTambuttegamaMarketPricesFromPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" })
      }

      const result = await MarketPriceService.processTambuttegamaPDF(req.file)

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
  },
  async create(req, res) {
    try {
      const { price, date, Date, economic_center_location_id, price_type_id, product_id, verify, isVerify } = req.body
      const resolvedDate = date ?? Date
      const resolvedVerify = verify ?? isVerify
      const result = await MarketPriceService.create(
        price,
        resolvedDate,
        economic_center_location_id,
        price_type_id,
        product_id,
        resolvedVerify
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
    const { price, date, Date, economic_center_location_id, price_type_id, product_id, verify } = req.body
    const resolvedDate = date ?? Date
    try {
      const result = await MarketPriceService.updateById(id, {
        price,
        date: resolvedDate,
        economic_center_location_id,
        price_type_id,
        product_id,
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
    const { verify, isVerify } = req.body
    const resolvedVerify = verify ?? isVerify
    try {
      const result = await MarketPriceService.verifyById(id, resolvedVerify)
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

  verifyAll: async (req, res) => {
    const { verify, isVerify } = req.body
    const resolvedVerify = verify ?? isVerify
    try {
      const result = await MarketPriceService.verifyAll(resolvedVerify)
      return res.status(200).json({
        response_code: 200,
        status: true,
        message: "Market prices verified successfully!",
        result,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ response_code: 500, status: false, message: "Error occurred while verifying Market prices!" })
    }
  },

  verifyMany: async (req, res) => {
    const { ids, verify, isVerify } = req.body
    const resolvedVerify = verify ?? isVerify
    const normalizedIds = Array.isArray(ids)
      ? ids
          .map((id) => Number.parseInt(id, 10))
          .filter((id) => Number.isInteger(id) && id > 0)
      : []

    if (normalizedIds.length === 0) {
      return res.status(400).json({ response_code: 400, status: false, message: "At least one market price id is required!" })
    }

    try {
      const result = await MarketPriceService.verifyMany(normalizedIds, resolvedVerify)
      if (result === 0) {
        return res.status(404).json({ response_code: 404, status: false, message: "Market prices not found!" })
      }

      return res.status(200).json({
        response_code: 200,
        status: true,
        message: "Market prices updated successfully!",
        result,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ response_code: 500, status: false, message: "Error occurred while updating Market prices!" })
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

  deleteMany: async (req, res) => {
    const { ids } = req.body
    const normalizedIds = Array.isArray(ids)
      ? ids
          .map((id) => Number.parseInt(id, 10))
          .filter((id) => Number.isInteger(id) && id > 0)
      : []

    if (normalizedIds.length === 0) {
      return res.status(400).json({ response_code: 400, status: false, message: "At least one market price id is required!" })
    }

    try {
      const result = await MarketPriceService.deleteMany(normalizedIds)
      if (result === 0) {
        return res.status(404).json({ response_code: 404, status: false, message: "Market prices not found!" })
      }

      return res.status(200).json({
        response_code: 200,
        status: true,
        message: "Market prices deleted successfully!",
        result,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ response_code: 500, status: false, message: "Error occurred while deleting Market prices!" })
    }
  },

}

export default MarketPriceController

import fs from "node:fs"
import { PDFParse } from "pdf-parse"
import MarketPriceRepository from "../repositories/market_price.repo.js"
import parseDambullaPDFRows from "../utils/pdfDambullaParser.js"
import parseTambuttegamaPDFRows from "../utils/pdfTambuttegamaParser.js"

const MarketPriceService = {
  async create(price, date, economic_center_location_id, price_type_id, product_id, verify) {
    try {
      const result = await MarketPriceRepository.create(
        price,
        date,
        economic_center_location_id,
        price_type_id,
        product_id,
        verify
      )
      return { status: true, result }
    } catch (error) {
      return { status: false, message: error.message }
    }
  },

  async getAll() {
    return MarketPriceRepository.getAll()
  },

  async findById(id) {
    return MarketPriceRepository.findById(id)
  },

  async updateById(id, payload) {
    return MarketPriceRepository.updateById(id, payload)
  },

  async verifyById(id, verify) {
    return MarketPriceRepository.verifyById(id, verify)
  },

  async verifyMany(ids, verify) {
    return MarketPriceRepository.verifyMany(ids, verify)
  },

  async verifyAll(verify) {
    return MarketPriceRepository.verifyAll(verify)
  },

  async deleteById(id) {
    return MarketPriceRepository.deleteById(id)
  },

  async deleteMany(ids) {
    return MarketPriceRepository.deleteMany(ids)
  },

  async processDambullaPDF(input) {
    try {
      let buffer
      let cleanupPath = null
      // Determine how to read the PDF data based on the input type
      if (Buffer.isBuffer(input)) {
        buffer = input
      } else if (typeof input === "string") {
        cleanupPath = input
        buffer = fs.readFileSync(input)
      } else if (input?.buffer && Buffer.isBuffer(input.buffer)) {
        buffer = input.buffer
      } else if (typeof input?.path === "string") {
        cleanupPath = input.path
        buffer = fs.readFileSync(input.path)
      } else {
        throw new TypeError("No PDF file data received")
      }

      //This function use to extract text from PDF and parse it to rows of market price data
      const parser = new PDFParse({ data: buffer })
      const textResult = await parser.getText()
      await parser.destroy()

      const { rows, meta } = await parseDambullaPDFRows(textResult.text)

      if (rows.length > 0) {
        await MarketPriceRepository.appendMarketPrices(rows)
      }

      if (cleanupPath) {
        try {
          fs.unlinkSync(cleanupPath) // remove PDF after processing
        } catch {
          // ignore cleanup errors
        }
      }

      return { count: rows.length, meta }
    } catch (err) {
      throw new Error("Failed to process PDF: " + err.message)
    }
  },

    async processTambuttegamaPDF(input) {
    try {
      let buffer
      let cleanupPath = null
      // Determine how to read the PDF data based on the input type
      if (Buffer.isBuffer(input)) {
        buffer = input
      } else if (typeof input === "string") {
        cleanupPath = input
        buffer = fs.readFileSync(input)
      } else if (input?.buffer && Buffer.isBuffer(input.buffer)) {
        buffer = input.buffer
      } else if (typeof input?.path === "string") {
        cleanupPath = input.path
        buffer = fs.readFileSync(input.path)
      } else {
        throw new TypeError("No PDF file data received")
      }

      //This function use to extract text from PDF and parse it to rows of market price data
      const parser = new PDFParse({ data: buffer })
      const textResult = await parser.getText()
      await parser.destroy()

      const { rows, meta } = await parseTambuttegamaPDFRows(textResult.text)

      if (rows.length > 0) {
        await MarketPriceRepository.appendMarketPrices(rows)
      }

      if (cleanupPath) {
        try {
          fs.unlinkSync(cleanupPath) // remove PDF after processing
        } catch {
          // ignore cleanup errors
        }
      }

      return { count: rows.length, meta }
    } catch (err) {
      throw new Error("Failed to process PDF: " + err.message)
    }
  }
}

export default MarketPriceService

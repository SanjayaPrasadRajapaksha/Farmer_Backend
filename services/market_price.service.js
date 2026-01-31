import fs from "fs"
import { PDFParse } from "pdf-parse"
import MarketPriceRepository from "../repositories/market_price.repo.js"
import parsePDFRows from "../utils/pdfParser.js"

class MarketPriceService {
  static async processPDF(input) {
    try {
      let buffer
      let cleanupPath = null

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
        throw new Error("No PDF file data received")
      }

      const parser = new PDFParse({ data: buffer })
      const textResult = await parser.getText()
      await parser.destroy()

      const { rows, meta } = await parsePDFRows(textResult.text)

      if (rows.length > 0) {
        const { economic_center_location_id, price_type_id, Date } = rows[0]
        await MarketPriceRepository.replaceMarketPricesForCriteria(
          { economic_center_location_id, price_type_id, Date },
          rows
        )
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

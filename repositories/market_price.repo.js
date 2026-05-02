import Economic_Center_Location from "../models/economic_center_location.model.js"
import Market_Price from "../models/market_price.model.js"
import Price_Type from "../models/price_type.model.js"
import Product from "../models/product.model.js"

const MarketPriceRepository = {
  async create(price, date, economic_center_location_id, price_type_id, product_id, verify = false) {
    return Market_Price.create({
      price,
      date,
      economic_center_location_id,
      price_type_id,
      product_id,
      verify,
    })
  },

  async findById(id) {
    return Market_Price.findOne({ where: { id } })
  },

  async getAll() {
    return Market_Price.findAll({
      include: [Economic_Center_Location, Price_Type, Product],
      order: [["date", "DESC"]],
    })
  },

  async updateById(id, payload = {}) {
    const {
      price,
      date,
      Date: dateLegacy,
      economic_center_location_id,
      price_type_id,
      product_id,
    } = payload

    const resolvedDate = date ?? dateLegacy

    const updateData = {}
    if (price !== undefined) updateData.price = price
    if (resolvedDate !== undefined) updateData.date = resolvedDate
    if (economic_center_location_id !== undefined) updateData.economic_center_location_id = economic_center_location_id
    if (price_type_id !== undefined) updateData.price_type_id = price_type_id
    if (product_id !== undefined) updateData.product_id = product_id

    if (Object.keys(updateData).length === 0) return 0

    const result = await Market_Price.update(updateData, { where: { id } })
    return result[0]
  },

  async verifyById(id, verify) {
    const result = await Market_Price.update(
      { verify: verify },
      { where: { id } }
    )
    return result[0]
  },

  async verifyMany(ids, verify) {
    const result = await Market_Price.update(
      { verify: verify },
      { where: { id: ids } }
    )
    return result[0]
  },

  async verifyAll(verify) {
    const result = await Market_Price.update(
      { verify: verify },
      { where: {} }
    )
    return result[0]
  },

  async deleteById(id) {
    return Market_Price.destroy({ where: { id } })
  },

  async deleteMany(ids) {
    return Market_Price.destroy({ where: { id: ids } })
  },

  async bulkCreateMarketPrices(data) {
    return Market_Price.bulkCreate(data, { ignoreDuplicates: true })
  },

  // Append-only insert (no delete, no update). Used by PDF uploads when you want to keep all previous rows.
  async appendMarketPrices(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return []
    return Market_Price.bulkCreate(rows)
  },

  async replaceMarketPricesForCriteria(criteria, data) {
    const sequelize = Market_Price.sequelize
    return sequelize.transaction(async (transaction) => {
      await Market_Price.destroy({ where: criteria, transaction })
      return Market_Price.bulkCreate(data, { transaction })
    })
  }
}

export default MarketPriceRepository

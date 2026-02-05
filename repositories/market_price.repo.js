import Market_Price from "../models/market_price.model.js"

const MarketPriceRepository = {
  async create(price, date, economic_center_location_id, price_type_id, product_id, isVerify = false) {
    return Market_Price.create({
      price,
      Date: date,
      economic_center_location_id,
      price_type_id,
      product_id,
      isVerify,
    })
  },

  async findById(id) {
    return Market_Price.findOne({ where: { id } })
  },

  async getAll() {
    return Market_Price.findAll({})
  },

  async updateById(id, payload = {}) {
    const {
      price,
      Date: date,
      economic_center_location_id,
      price_type_id,
      product_id,
      isVerify,
    } = payload

    const updateData = {}
    if (price !== undefined) updateData.price = price
    if (date !== undefined) updateData.Date = date
    if (economic_center_location_id !== undefined) updateData.economic_center_location_id = economic_center_location_id
    if (price_type_id !== undefined) updateData.price_type_id = price_type_id
    if (product_id !== undefined) updateData.product_id = product_id
    if (isVerify !== undefined) updateData.isVerify = isVerify

    if (Object.keys(updateData).length === 0) return 0

    const result = await Market_Price.update(updateData, { where: { id } })
    return result[0]
  },

  async verifyById(id, isVerify) {
    const result = await Market_Price.update(
      { isVerify:isVerify },
      { where: { id } }
    )
    return result[0]
  },

  async deleteById(id) {
    return Market_Price.destroy({ where: { id } })
  },

  async bulkCreateMarketPrices(data) {
    return Market_Price.bulkCreate(data, { ignoreDuplicates: true })
  },

  // Append-only insert (no delete, no update). Used by PDF uploads when you want to keep all previous rows.
  async appendMarketPrices(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return []
    return Market_Price.bulkCreate(rows)
  },

  // Update existing rows by composite key (product/location/type/date), otherwise insert.
  // This prevents wiping all existing market prices when uploading another PDF for the same day.
  async upsertMarketPricesByCompositeKey(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return 0

    const sequelize = Market_Price.sequelize
    return sequelize.transaction(async (transaction) => {
      let affected = 0

      for (const row of rows) {
        const {
          product_id,
          economic_center_location_id,
          price_type_id,
          Date: date,
        } = row

        const [updatedCount] = await Market_Price.update(
          {
            price: row.price,
            isVerify: row.isVerify ?? false,
          },
          {
            where: {
              product_id,
              economic_center_location_id,
              price_type_id,
              Date: date,
            },
            transaction,
          }
        )

        if (updatedCount === 0) {
          await Market_Price.create(row, { transaction })
        }

        affected += 1
      }

      return affected
    })
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

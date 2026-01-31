import Market_Price from "../models/market_price.model.js"

class MarketPriceRepository {
  static async bulkCreateMarketPrices(data) {
    return Market_Price.bulkCreate(data, { ignoreDuplicates: true })
  }

  static async replaceMarketPricesForCriteria(criteria, data) {
    const sequelize = Market_Price.sequelize
    return sequelize.transaction(async (transaction) => {
      await Market_Price.destroy({ where: criteria, transaction })
      return Market_Price.bulkCreate(data, { transaction })
    })
  }
}

export default MarketPriceRepository

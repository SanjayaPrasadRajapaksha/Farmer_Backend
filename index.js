import cors from "cors"
import dotenv from "dotenv"
import express from "express"

import sequelize from "./config/db.config.js"
import marketPriceRoutes from "./routes/market_price.route.js"

dotenv.config()

// Ensure models/associations are registered before sync
import "./models/category.model.js"
import "./models/product.model.js"
import "./models/economic_center_location.model.js"
import "./models/price_type.model.js"
import "./models/market_price.model.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/health", (_req, res) => res.json({ ok: true }))

app.use("/api/market_price", marketPriceRoutes)

const PORT = process.env.PORT || 8000

async function start() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("Unable to start server:", err)
    process.exit(1)
  }
}

start()

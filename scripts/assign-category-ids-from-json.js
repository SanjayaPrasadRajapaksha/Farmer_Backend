import fs from "fs"
import path from "path"
import { Op } from "sequelize"
import { fileURLToPath } from "url"

import sequelize from "../config/db.config.js"
import Product from "../models/product.model.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function normalizeName(name) {
  return String(name ?? "")
    .replaceAll(/\u00a0/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
}

function loadCategoryJson() {
  const jsonPath = path.resolve(__dirname, "..", "category.json")
  const raw = fs.readFileSync(jsonPath, "utf8")
  return JSON.parse(raw)
}

// Your requested fixed mapping: category id 1..5
const CATEGORY_ID_MAP = {
  Vegetable: 1,
  Fruit: 2,
  Potatoes: 3,
  "Leaf Vegetable": 4,
  "Rice & Grains": 5
}

async function main() {
  const categoryMap = loadCategoryJson()

  const report = {
    updatedTotal: 0,
    perCategory: {},
    missingProducts: {}
  }

  try {
    await sequelize.authenticate()

    await sequelize.transaction(async (transaction) => {
      for (const [categoryName, productNamesRaw] of Object.entries(categoryMap)) {
        const categoryId = CATEGORY_ID_MAP[categoryName]
        if (!categoryId) {
          throw new Error(
            `Unknown category '${categoryName}'. Allowed: ${Object.keys(CATEGORY_ID_MAP).join(", ")}`
          )
        }

        if (!Array.isArray(productNamesRaw)) {
          throw new TypeError(`Category '${categoryName}' must be an array of product names`)
        }

        const productNames = productNamesRaw.map(normalizeName).filter(Boolean)
        if (productNames.length === 0) {
          report.perCategory[categoryName] = {
            categoryId,
            provided: 0,
            found: 0,
            updated: 0
          }
          continue
        }

        const existing = await Product.findAll({
          attributes: ["id", "name"],
          where: { name: { [Op.in]: productNames } },
          transaction
        })

        const existingNames = new Set(existing.map((p) => p.name))
        const missing = productNames.filter((n) => !existingNames.has(n))

        const [updated] = await Product.update(
          { category_id: categoryId },
          {
            where: { name: { [Op.in]: productNames } },
            transaction
          }
        )

        report.updatedTotal += updated
        report.perCategory[categoryName] = {
          categoryId,
          provided: productNames.length,
          found: existing.length,
          updated
        }

        if (missing.length > 0) {
          report.missingProducts[categoryName] = missing
        }
      }
    })

    console.log("\nCategory assignment report:")
    console.log(JSON.stringify(report, null, 2))
  } finally {
    await sequelize.close()
  }
}

main().catch((err) => {
  console.error("assign-category-ids-from-json failed:", err)
  process.exitCode = 1
})

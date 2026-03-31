import fs from "fs"
import Category from "../models/category.model.js"
import Economic_Center_Location from "../models/economic_center_location.model.js"
import Price_Type from "../models/price_type.model.js"
import Product from "../models/product.model.js"

// PDF-safe regex
//This regex helps you find each row and split it into fields.
const rowRegex = /(\d+)\s+(.+?)\s+Rs\.\s*(\d+(?:\.\d+)?)\s+Rs\.\s*(\d+(?:\.\d+)?)/gi

// This function normalizes text lines from PDFs by replacing non-breaking spaces with regular spaces.
function normalizePdfTextLine(line) {
  return line.replace(/\u00a0/g, " ") // NBSP from PDFs
}

// This function converts price strings like "1,234.56" into numbers.
function parsePdfNumber(numStr) {
  return parseFloat(String(numStr).replace(/,/g, ""))
}
// This function cleans up product names by normalizing spaces and trimming.
function normalizeProductName(name) {
  return String(name ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

let productToCategoryNameCache = null
let categoryIdCache = new Map()

function loadCategoryJsonMapping() {
  if (productToCategoryNameCache) return productToCategoryNameCache

  try {
    const categoryJsonUrl = new URL("../category.json", import.meta.url)
    const raw = fs.readFileSync(categoryJsonUrl, "utf-8")
    const parsed = JSON.parse(raw)

    const mapping = new Map()
    for (const [categoryName, productNames] of Object.entries(parsed)) {
      if (!Array.isArray(productNames)) continue
      for (const productName of productNames) {
        const clean = normalizeProductName(productName)
        if (!clean) continue
        mapping.set(clean.toLowerCase(), String(categoryName).trim())
      }
    }

    productToCategoryNameCache = mapping
    return mapping
  } catch (err) {
    console.warn("category.json mapping not loaded:", err.message)
    productToCategoryNameCache = new Map()
    return productToCategoryNameCache
  }
}

async function getCategoryIdByName(categoryName) {
  const clean = String(categoryName ?? "").trim()
  if (!clean) return null

  if (categoryIdCache.has(clean)) return categoryIdCache.get(clean)

  const [category] = await Category.findOrCreate({
    where: { name: clean },
    defaults: { name: clean }
  })

  categoryIdCache.set(clean, category.id)
  return category.id
}

async function getProductId(name, category_id = null) {
  const cleanName = normalizeProductName(name)

  const [product] = await Product.findOrCreate({
    where: { name: cleanName },
    defaults: { unit: 1, imageURL: "", category_id: category_id ?? null }
  })

  // If product already exists but missing category, update it
  if (category_id && !product.category_id) {
    product.category_id = category_id
    await product.save()
  }

  return product.id
}

async function getLocationId(name) {
  const [location] = await Economic_Center_Location.findOrCreate({
    where: { name: name.trim() }
  })
  return location.id
}

async function getPriceTypeId(typeName) {
  const [priceType] = await Price_Type.findOrCreate({
    where: { name: typeName }
  })
  return priceType.id
}

export default async function parseDambullaPDFRows(
  text,
  locationName = "Dambulla",
  priceTypeName = "Daily Market Price"
) {
  const categoryMapping = loadCategoryJsonMapping()
  const resultsByKey = new Map()
  const unmatchedLines = []
  const duplicateRows = []
  const productNameCounts = new Map()
  let categorizedProducts = 0
  let uncategorizedProducts = 0

  const location_id = await getLocationId(locationName)
  const price_type_id = await getPriceTypeId(priceTypeName)

  let totalParsed = 0
  const dateStr = new Date().toISOString().split("T")[0]

  // Parse across the entire text so rows/names split by newlines still match.
  const normalizedText = normalizePdfTextLine(text)
  rowRegex.lastIndex = 0

  let match
  while ((match = rowRegex.exec(normalizedText)) !== null) {
    totalParsed++
    //match[1] → row number

    //match[2] → product name

    //match[3] → min price

    //match[4] → max price
    const productName = String(match[2] ?? "")
    const minPrice = parsePdfNumber(match[3])
    const maxPrice = parsePdfNumber(match[4])

    // Skip clearly invalid matches (helps avoid accidental matches on headers/footers)
    if (!productName.trim()) continue
    if (!/\p{L}/u.test(productName)) continue
    if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) continue
    if (minPrice <= 0 || maxPrice <= 0) continue
    if (maxPrice < minPrice) continue

    const cleanProductName = productName
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    productNameCounts.set(
      cleanProductName,
      (productNameCounts.get(cleanProductName) ?? 0) + 1
    )

    const avgPrice = ((minPrice + maxPrice) / 2).toFixed(2)

    const mappedCategoryName = categoryMapping.get(cleanProductName.toLowerCase())
    const category_id = mappedCategoryName
      ? await getCategoryIdByName(mappedCategoryName)
      : null

    if (category_id) categorizedProducts++
    else uncategorizedProducts++

    const product_id = await getProductId(cleanProductName, category_id)

    const key = `${product_id}|${location_id}|${price_type_id}|${dateStr}`
    const previous = resultsByKey.get(key)
    if (previous) {
      duplicateRows.push({
        productName: cleanProductName,
        product_id,
        previousPrice: previous.price,
        newPrice: avgPrice
      })
    }

    resultsByKey.set(key, {
      product_id,
      economic_center_location_id: location_id,
      price_type_id,
      price: avgPrice,
      date: dateStr
    })
  }

  // Keep a small sample of lines that contain Rs but didn't match, for debugging.
  for (const line of normalizedText.split("\n")) {
    if (unmatchedLines.length >= 25) break
    const trimmed = line.trim()
    if (!trimmed) continue
    if (!/\bRs\b/i.test(trimmed)) continue
    rowRegex.lastIndex = 0
    if (!rowRegex.test(trimmed)) {
      unmatchedLines.push(trimmed)
    }
  }

  const results = Array.from(resultsByKey.values())
  console.log("PDF ROWS PARSED:", totalParsed, "UNIQUE ROWS:", results.length)
  if (unmatchedLines.length > 0) {
    console.log("PDF UNMATCHED LINES (sample):", unmatchedLines.length)
    console.log(unmatchedLines.slice(0, 5))
  }

  const duplicateProducts = Array.from(productNameCounts.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))

  return {
    rows: results,
    meta: {
      totalParsed,
      uniqueRows: results.length,
      unmatchedLines,
      date: dateStr,
      duplicatesCollapsed: duplicateRows.length,
      duplicateProducts,
      duplicateRowsSample: duplicateRows.slice(0, 10),
      categorizedProducts,
      uncategorizedProducts
    }
  }
}

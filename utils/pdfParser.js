import Economic_Center_Location from "../models/economic_center_location.model.js"
import Price_Type from "../models/price_type.model.js"
import Product from "../models/product.model.js"

// 🔹 PDF-safe regex
const rowRegex =
  /(\d+)\s+([\s\S]+?)\s+Rs\.?\s*([\d,]+(?:\.\d{1,2})?)\s+Rs\.?\s*([\d,]+(?:\.\d{1,2})?)/gi

function normalizePdfTextLine(line) {
  return line.replace(/\u00a0/g, " ") // NBSP from PDFs
}

function parsePdfNumber(numStr) {
  return parseFloat(String(numStr).replace(/,/g, ""))
}

async function getProductId(name) {
  const cleanName = name.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim()

  const [product] = await Product.findOrCreate({
    where: { name: cleanName },
    defaults: { unit: 1, imageURL: "", category_id: null }
  })

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

export default async function parsePDFRows(
  text,
  locationName = "Dambulla",
  priceTypeName = "Retail"
) {
  const resultsByKey = new Map()
  const unmatchedLines = []
  const duplicateRows = []
  const productNameCounts = new Map()

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

    const product_id = await getProductId(cleanProductName)

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
      Date: dateStr
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
      duplicateRowsSample: duplicateRows.slice(0, 10)
    }
  }
}

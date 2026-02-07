import express from "express"
import request from "supertest"

function buildApp() {
  const app = express()

  const prices = [
    { id: 1, price: "100.00" },
    { id: 2, price: "200.00" },
  ]

  app.get("/prices", (_req, res) => {
    res.status(200).json(prices)
  })

  app.get("/prices/:id", (req, res) => {
    const price = prices.find((p) => p.id === Number(req.params.id))
    if (!price) return res.status(404).json({ message: "Not found" })
    return res.json(price)
  })

  return app
}

describe("Simple REST API", () => {

  test("GET /prices -> 200", async () => {
    const res = await request(buildApp()).get("/prices")

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(2)
  })

  test("GET /prices/1 -> 200", async () => {
    const res = await request(buildApp()).get("/prices/1")

    expect(res.statusCode).toBe(200)
    expect(res.body.price).toBe("100.00")
  })

  test("GET /prices/99 -> 404", async () => {
    const res = await request(buildApp()).get("/prices/99")

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe("Not found")
  })

})

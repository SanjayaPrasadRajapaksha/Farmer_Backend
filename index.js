import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/db.config.js";
import Category, { initializeCategoryTable } from "./models/category.model.js";
import market_price_router from "./routes/market_price.route.js";
import CategoryRouter from "./routes/category.route.js";
import Economic_CenterRouter from "./routes/economic_center_location.route.js";
import Price_TypeRouter from "./routes/price_type.route.js";
import ProductRouter from "./routes/product.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// Connect database
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully");
    })
    .catch((error) => {
        console.error("Unable to connect to the database: ", error);
    });

// Table creation
// Table creation + seeding
sequelize
    .sync({ force: false })
    .then(async () => {
        console.log("Tables created");
        await initializeCategoryTable(); // <-- seed default categories
    })
    .catch((error) => {
        console.error("Unable to create tables: ", error);
    });


// Main Routes
app.use('/api/market_price',market_price_router);
app.use('/api/category', CategoryRouter);
app.use('/api/economic_center', Economic_CenterRouter);
app.use('/api/price_type', Price_TypeRouter);
app.use('/api/product', ProductRouter);

// Run server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
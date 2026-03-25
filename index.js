import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./config/db.config.js";
import { initializeCategoryTable } from "./models/category.model.js";
import "./models/economic_center_location.model.js";
import "./models/market_price.model.js";
import "./models/price_type.model.js";
import "./models/product.model.js";
import CategoryRouter from "./routes/category.route.js";
import Economic_CenterRouter from "./routes/economic_center_location.route.js";
import market_price_router from "./routes/market_price.route.js";
import Price_TypeRouter from "./routes/price_type.route.js";
import ProductRouter from "./routes/product.route.js";
import RoleRouter from "./routes/role.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());


// Main Routes
app.use('/api/market_price',market_price_router);
app.use('/api/category', CategoryRouter);
app.use('/api/economic_center', Economic_CenterRouter);
app.use('/api/price_type', Price_TypeRouter);
app.use('/api/product', ProductRouter);
app.use('/api/role', RoleRouter);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully");

        await sequelize.sync({ force: false });
        console.log("Tables created");

        await initializeCategoryTable(); // seed default categories

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Startup failed: ", error);
        process.exit(1);
    }
}

startServer();
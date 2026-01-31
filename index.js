import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";

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
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("Tables created");
    })
    .catch((error) => {
        console.error("Unable to create tables: ", error);
    });

// Main Routes


// Run server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
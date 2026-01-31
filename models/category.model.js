// models/category.model.js
import fs from "fs";
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: "category",
    timestamps: true
});

export default Category;

// Seed default categories after table creation
export const seedCategories = async () => {
    let CATEGORY_KEYWORDS = [
        "Vegetable",
        "Fruit",
        "Potatoes",
        "Leaf Vegetable",
        "Rice & Grains"
    ];

    // Prefer seeding from category.json keys so DB categories match the JSON mapping.
    try {
        const categoryJsonUrl = new URL("../category.json", import.meta.url);
        const raw = fs.readFileSync(categoryJsonUrl, "utf-8");
        const parsed = JSON.parse(raw);
        const keys = Object.keys(parsed).map((k) => String(k).trim()).filter(Boolean);
        if (keys.length > 0) {
            CATEGORY_KEYWORDS = keys;
        }
    } catch (error) {
        console.warn("Could not load category.json for seeding, using defaults:", error.message);
    }

    for (const name of CATEGORY_KEYWORDS) {
        // Check if category already exists to avoid duplicates
        const [category, created] = await Category.findOrCreate({
            where: { name },
            defaults: { name }
        });
        if (created) {
            console.log(`Category "${name}" added.`);
        }
    }
};

// Initialize table and seed categories
export const initializeCategoryTable = async () => {
    try {
        await Category.sync(); // Creates the table if it doesn't exist
        await seedCategories(); // Seeds default categories
    } catch (error) {
        console.error("Error initializing Category table:", error);
    }
};

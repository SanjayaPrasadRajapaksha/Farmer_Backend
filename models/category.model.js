// models/category.model.js
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
    const CATEGORY_KEYWORDS = [
        "Vegetable",
        "Fruit",
        "Potatoes",
        "Leaf Vegetable",
        "Rice"
    ];

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

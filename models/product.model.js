// models/user.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Category from './category.model.js';


const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    imageURL: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: 'id'
        },
    },
}, {
    tableName: "product",
    timestamps: true
});

export default Product;

Product.belongsTo(Category, { foreignKey: 'category_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
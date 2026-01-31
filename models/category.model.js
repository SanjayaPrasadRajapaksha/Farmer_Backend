// models/user.model.js
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
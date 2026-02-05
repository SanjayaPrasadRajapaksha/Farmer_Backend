import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';


const Price_Type = sequelize.define('Price_Type', {
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
    tableName: "Price_Type",
    timestamps: true
});

export default Price_Type;
import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

export const Contact = sequelize.define(
    "Contact",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

    },
    {
        tableName: "Contact",
    }
);
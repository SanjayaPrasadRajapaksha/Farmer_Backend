import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

export const Feedback = sequelize.define(
    "Feedback",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },

        message: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },

        rate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },

        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "feedback",
    }
);

export default Feedback;
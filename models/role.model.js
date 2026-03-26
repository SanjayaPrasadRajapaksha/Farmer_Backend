import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

export const Role = sequelize.define(
    "Role",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "role",
    }
);

export default Role;
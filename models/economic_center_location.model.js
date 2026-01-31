// models/user.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';


const Economic_Center_Location = sequelize.define('Economic_Center_Location', {
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
    tableName: "economic_center_location",
    timestamps: true
});

export default Economic_Center_Location;
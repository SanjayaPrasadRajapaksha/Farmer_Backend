import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Economic_Center_Location from './economic_center_location.model.js';
import Price_Type from './price_type.model.js';
import Product from './product.model.js';

const Market_Price = sequelize.define('Market_Price', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    isVerify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    Date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    economic_center_location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Economic_Center_Location,
            key: 'id'
        },
    },
    price_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Price_Type,
            key: 'id'
        },
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Product,
            key: 'id'
        },
    },
}, {
    tableName: "market_price",
    timestamps: true
});

export default Market_Price;

Market_Price.belongsTo(Economic_Center_Location, { foreignKey: 'economic_center_location_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
Economic_Center_Location.hasMany(Market_Price, { foreignKey: 'economic_center_location_id', onDelete: "CASCADE", onUpdate: "CASCADE" });

Market_Price.belongsTo(Price_Type, { foreignKey: 'price_type_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
Price_Type.hasMany(Market_Price, { foreignKey: 'price_type_id', onDelete: "CASCADE", onUpdate: "CASCADE" });

Market_Price.belongsTo(Product, { foreignKey: 'product_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
Product.hasMany(Market_Price, { foreignKey: 'product_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
// models/user.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Role from './role.model.js';


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otpExpiryTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Role,
            key: 'id'
        },
    },
}, {
    tableName: "user",
    timestamps: true
});

export default User;

// Associations with cascade
User.belongsTo(Role, { foreignKey: 'role_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
Role.hasMany(User, { foreignKey: 'role_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
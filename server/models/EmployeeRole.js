// models/EmployeeRole.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeRole = sequelize.define(
    'EmployeeRole', 
    {
        employeeRoleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        employeeRole: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
    },
);

module.exports = EmployeeRole;
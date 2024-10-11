// models/EmployeeRolesOtherRole.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmployeeRolesOtherRole = sequelize.define(
  "EmployeeRolesOtherRole",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    employeeRoleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Disable automatic timestamps
  }
);

module.exports = EmployeeRolesOtherRole;

// models/ViolationLocal.js

const { DataTypes } = require("sequelize");
const localDb = require("../config/databaseLocal.js");

const ViolationLocal = localDb.define(
  "Violation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    violation_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ViolationLocal;

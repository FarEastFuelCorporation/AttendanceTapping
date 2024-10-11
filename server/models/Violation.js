// models/Violation.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const Violation = sequelize.define(
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

module.exports = Violation;

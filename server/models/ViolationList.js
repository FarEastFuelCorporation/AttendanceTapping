// models/Violation.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const ViolationList = sequelize.define(
  "ViolationList",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    violation_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ViolationList;

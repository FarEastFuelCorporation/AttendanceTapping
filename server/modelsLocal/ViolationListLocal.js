// models/ViolationListLocal.js

const { DataTypes } = require("sequelize");
const localDb = require("../config/databaseLocal.js");

const ViolationListLocal = localDb.define(
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

module.exports = ViolationListLocal;

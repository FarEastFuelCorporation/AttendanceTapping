// models/GeoTable.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GeoTable = sequelize.define("GeoTable", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  barangay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  municipality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = GeoTable;

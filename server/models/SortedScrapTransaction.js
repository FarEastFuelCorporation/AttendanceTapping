// models/SortedScrapTransaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const SortedScrapTransaction = sequelize.define(
  "SortedScrapTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    sortedTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    scrapTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    paranoid: true, // Enable soft deletes
  }
);

module.exports = SortedScrapTransaction;

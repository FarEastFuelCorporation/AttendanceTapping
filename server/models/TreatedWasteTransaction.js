// models/TreatedWasteTransaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const TreatedWasteTransaction = sequelize.define(
  "TreatedWasteTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    treatedTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sortedWasteTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    treatmentProcessId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    treatmentMachineId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    treatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    treatedTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    paranoid: true, // Enable soft deletes
  }
);

module.exports = TreatedWasteTransaction;

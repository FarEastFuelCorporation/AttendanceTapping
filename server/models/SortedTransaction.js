// models/SortedTransaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const SortedTransaction = sequelize.define(
  "SortedTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    receivedTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sortedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sortedTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    totalSortedWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discrepancyWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isFinishTreated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Paranoid option for soft deletion
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
  }
);

module.exports = SortedTransaction;

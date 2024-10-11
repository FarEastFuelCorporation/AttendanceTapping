// models/ReceivedTransaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const ReceivedTransaction = sequelize.define(
  "ReceivedTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    scheduledTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dispatchedTransactionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    driverId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receivedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    receivedTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    pttNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manifestNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pullOutFormNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manifestWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    clientWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    grossWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tareWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    netWeight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    submitTo: {
      type: DataTypes.ENUM,
      values: ["SORTING", "WAREHOUSE"],
      allowNull: true,
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

module.exports = ReceivedTransaction;

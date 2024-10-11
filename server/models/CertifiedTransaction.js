// models/CertifiedTransaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const CertifiedTransaction = sequelize.define(
  "CertifiedTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    bookedTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sortedTransactionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    certificateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certifiedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    certifiedTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    typeOfCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfWeight: {
      type: DataTypes.STRING,
      allowNull: false,
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

module.exports = CertifiedTransaction;

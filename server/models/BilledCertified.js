// models/BilledCertified.js

const sequelize = require("../config/database");

const BilledCertified = sequelize.define(
  "BilledCertified",
  {
    // You can define additional fields here if needed
  },
  {
    timestamps: false, // Optional: disable timestamps if not needed
    paranoid: true, // Enable soft deletion (paranoid mode)
  }
);

module.exports = BilledCertified; // Export the BilledCertified model, not BilledTransaction

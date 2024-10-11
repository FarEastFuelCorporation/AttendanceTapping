// routes/billingDistributionTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBillingDistributionTransactionController,
  getBillingDistributionTransactionsController,
  updateBillingDistributionTransactionController,
  deleteBillingDistributionTransactionController,
} = require("../controllers/billingDistributionTransactionController");

// Create Billing Distribution Transaction route
router.post("/", createBillingDistributionTransactionController);

// Get Billing Distribution Transactions route
router.get("/", getBillingDistributionTransactionsController);

// Update Billing Distribution Transaction route
router.put("/:id", updateBillingDistributionTransactionController);

// Delete Billing Distribution Transaction route
router.delete("/:id", deleteBillingDistributionTransactionController);

module.exports = router;

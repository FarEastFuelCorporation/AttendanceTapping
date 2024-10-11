// routes/billingApprovalTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBillingApprovalTransactionController,
  getBillingApprovalTransactionsController,
  updateBillingApprovalTransactionController,
  deleteBillingApprovalTransactionController,
} = require("../controllers/billingApprovalTransactionController");

// Create Billing Approval Transaction route
router.post("/", createBillingApprovalTransactionController);

// Get Billing Approval Transactions route
router.get("/", getBillingApprovalTransactionsController);

// Update Billing Approval Transaction route
router.put("/:id", updateBillingApprovalTransactionController);

// Delete Billing Approval Transaction route
router.delete("/:id", deleteBillingApprovalTransactionController);

module.exports = router;

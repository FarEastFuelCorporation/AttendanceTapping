// routes/receivedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createReceivedTransactionController,
  getReceivedTransactionsController,
  updateReceivedTransactionController,
  deleteReceivedTransactionController,
} = require("../controllers/receivedTransactionController");

// Create Received Transaction route
router.post("/", createReceivedTransactionController);

// Get Received Transactions route
router.get("/", getReceivedTransactionsController);

// Update Received Transaction route
router.put("/:id", updateReceivedTransactionController);

// Delete Received Transaction route
router.delete("/:id", deleteReceivedTransactionController);

module.exports = router;

// routes/collectionTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createCollectedTransactionController,
  getCollectedTransactionsController,
  updateCollectedTransactionController,
  deleteCollectedTransactionController,
} = require("../controllers/collectionTransactionController");

// Create Collected Transaction route
router.post("/", createCollectedTransactionController);

// Get Collected Transactions route
router.get("/", getCollectedTransactionsController);

// Update Collected Transaction route
router.put("/:id", updateCollectedTransactionController);

// Delete Collected Transaction route
router.delete("/:id", deleteCollectedTransactionController);

module.exports = router;

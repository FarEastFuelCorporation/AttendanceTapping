// routes/dispatchedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createDispatchedTransactionController,
  getDispatchedTransactionsController,
  updateDispatchedTransactionController,
  deleteDispatchedTransactionController,
} = require("../controllers/dispatchedTransactionController");

// Create Dispatched Transaction route
router.post("/", createDispatchedTransactionController);

// Get Dispatched Transactions route
router.get("/", getDispatchedTransactionsController);

// Update Dispatched Transaction route
router.put("/:id", updateDispatchedTransactionController);

// Delete Dispatched Transaction route
router.delete("/:id", deleteDispatchedTransactionController);

module.exports = router;

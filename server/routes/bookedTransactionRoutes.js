// routes/bookedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createBookedTransactionController,
  getBookedTransactionsController,
  updateBookedTransactionController,
  deleteBookedTransactionController,
} = require("../controllers/bookedTransactionController");

// Create Booked Transaction route
router.post("/", createBookedTransactionController);

// Get Booked Transactions route
router.get("/", getBookedTransactionsController);

// Update Booked Transaction route
router.put("/:id", updateBookedTransactionController);

// Delete Booked Transaction route
router.delete("/:id", deleteBookedTransactionController);

module.exports = router;

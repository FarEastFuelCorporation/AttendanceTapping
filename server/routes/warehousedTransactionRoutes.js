// routes/warehousedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createWarehousedTransactionController,
  getWarehousedTransactionsController,
  updateWarehousedTransactionController,
  deleteWarehousedTransactionController,
} = require("../controllers/warehousedTransactionController");

// Create Warehoused Transaction route
router.post("/", createWarehousedTransactionController);

// Get Warehoused Transactions route
router.get("/", getWarehousedTransactionsController);

// Update Warehoused Transaction route
router.put("/:id", updateWarehousedTransactionController);

// Delete Warehoused Transaction route
router.delete("/:id", deleteWarehousedTransactionController);

module.exports = router;

// routes/plasticTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createPlasticTransactionController,
  getPlasticTransactionsController,
  updatePlasticTransactionController,
  deletePlasticTransactionController,
} = require("../controllers/plasticTransactionController");

// Create Plastic Transaction route
router.post("/", createPlasticTransactionController);

// Get Plastic Transactions route
router.get("/", getPlasticTransactionsController);

// Update Plastic Transaction route
router.put("/:id", updatePlasticTransactionController);

// Delete Plastic Transaction route
router.delete("/:id", deletePlasticTransactionController);

module.exports = router;

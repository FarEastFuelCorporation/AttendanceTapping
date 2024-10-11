// routes/certifiedTransactionRoutes.js

const express = require("express");
const router = express.Router();
const {
  createCertifiedTransactionController,
  getCertifiedTransactionsController,
  updateCertifiedTransactionController,
  deleteCertifiedTransactionController,
} = require("../controllers/certifiedTransactionController");

// Create Certified Transaction route
router.post("/", createCertifiedTransactionController);

// Get Certified Transactions route
router.get("/", getCertifiedTransactionsController);

// Update Certified Transaction route
router.put("/:id", updateCertifiedTransactionController);

// Delete Certified Transaction route
router.delete("/:id", deleteCertifiedTransactionController);

module.exports = router;

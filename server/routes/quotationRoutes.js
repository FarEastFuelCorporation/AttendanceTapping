// routes/quotationRoutes.js

const express = require("express");
const router = express.Router();
const {
  getQuotationsController,
  getQuotationController,
  createQuotationController,
  deleteQuotationController,
  updateQuotationController,
} = require("../controllers/quotationControllers");

// Create Quotation route
router.post("/", createQuotationController);

// Get Quotations route
router.get("/", getQuotationsController);

// Get Quotation route
router.get("/:id", getQuotationController);

// Update Quotation route
router.put("/:id", updateQuotationController);

// Delete Quotation route
router.delete("/:id", deleteQuotationController);

module.exports = router;

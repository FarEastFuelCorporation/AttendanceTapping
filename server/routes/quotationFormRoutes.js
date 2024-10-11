// routes/quotationFormRoutes.js

const express = require("express");
const router = express.Router();
const {
  getQuotationFormController,
} = require("../controllers/quotationFormController");

// Get Quotation route
router.get("/:id", getQuotationFormController);

module.exports = router;

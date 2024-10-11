// routes/billingRoutes.js

const express = require("express");
const router = express.Router();
const { getBillingController } = require("../controllers/billingController");

// Get Billing route
router.get("/:id", getBillingController);

module.exports = router;

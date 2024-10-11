// routes/certificateRoutes.js

const express = require("express");
const router = express.Router();
const {
  getCertificateController,
  getPlasticCertificateController,
} = require("../controllers/certificateController");

// Get Certificate of Destruction route
router.get("/:id", getCertificateController);

// Get Plastic Credit Certificate route
router.get("/plasticCredit/:id", getPlasticCertificateController);

// Get Plastic Waste Diversion Certificate route
router.get("/plasticWasteDiversion/:id", getPlasticCertificateController);

module.exports = router;

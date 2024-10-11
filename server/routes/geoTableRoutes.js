// routes/geoTableRoutes.js

const express = require("express");
const router = express.Router();
const {
  getProvincesController,
  getAllCitiesController,
  getCitiesController,
  getBarangaysController,
} = require("../controllers/geoTableController");

// Get Provinces route
router.get("/province", getProvincesController);

// Get All Cities route
router.get("/citY", getAllCitiesController);

// Get Cities route

router.get("/citY/:province", getCitiesController);

// Get Barangays route
router.get("/barangay/:city", getBarangaysController);

module.exports = router;

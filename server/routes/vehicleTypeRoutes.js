// routes/vehicleTypeRoutes.js

const express = require("express");
const router = express.Router();
const {
  createVehicleTypeController,
  getVehicleTypesController,
  updateVehicleTypeController,
  deleteVehicleTypeController,
} = require("../controllers/vehicleTypeController");

// Create Vehicle Type route
router.post("/", createVehicleTypeController);

// Get Vehicle Types route
router.get("/", getVehicleTypesController);

// Update Vehicle Type route
router.put("/:id", updateVehicleTypeController);

// Delete Vehicle Type route
router.delete("/:id", deleteVehicleTypeController);

module.exports = router;

// routes/vehicleRoutes.js

const express = require("express");
const router = express.Router();
const {
  createVehicleController,
  getVehiclesController,
  getVehiclesByVehicleTypeIdController,
  updateVehicleController,
  deleteVehicleController,
} = require("../controllers/vehicleController");

// Create Vehicle route
router.post("/", createVehicleController);

// Get Vehicles route
router.get("/", getVehiclesController);

// Get Vehicle by vehicleTypeId route
router.get("/:id", getVehiclesByVehicleTypeIdController);

// Update Vehicle route
router.put("/:id", updateVehicleController);

// Delete Vehicle route
router.delete("/:id", deleteVehicleController);

module.exports = router;

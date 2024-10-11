// routes/vehicleMaintenanceRequestRoutes.js

const express = require("express");
const router = express.Router();
const {
  createVehicleMaintenanceRequestController,
  getVehicleMaintenanceRequestsController,
  updateVehicleMaintenanceRequestController,
  deleteVehicleMaintenanceRequestController,
} = require("../controllers/vehicleMaintenanceController");

// Create Vehicle Maintenance Request route
router.post("/", createVehicleMaintenanceRequestController);

// Get Vehicle Maintenance Requests route
router.get("/", getVehicleMaintenanceRequestsController);

// Update Vehicle Maintenance Request route
router.put("/:id", updateVehicleMaintenanceRequestController);

// Delete Vehicle Maintenance Request route
router.delete("/:id", deleteVehicleMaintenanceRequestController);

module.exports = router;

// routes/treatmentMachineRoutes.js

const express = require("express");
const router = express.Router();
const {
  createTreatmentMachineController,
  getTreatmentMachinesController,
  updateTreatmentMachineController,
  deleteTreatmentMachineController,
} = require("../controllers/treatmentMachineController");

// Create TreatmentMachine route
router.post("/", createTreatmentMachineController);

// Get TreatmentMachines route
router.get("/", getTreatmentMachinesController);

// Update TreatmentMachine route
router.put("/:id", updateTreatmentMachineController);

// Delete TreatmentMachine route
router.delete("/:id", deleteTreatmentMachineController);

module.exports = router;

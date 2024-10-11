// routes/treatmentProcessRoutes.js

const express = require("express");
const router = express.Router();
const {
  getTreatmentProcessController,
  createTreatmentProcessController,
  updateTreatmentProcessController,
  deleteTreatmentProcessController,
} = require("../controllers/treatmentProcessController");

// Create Treatment Process route
router.post("/", createTreatmentProcessController);

// Get Treatment Process route
router.get("/", getTreatmentProcessController);

// Update Treatment Process route
router.put("/:id", updateTreatmentProcessController);

// Delete Treatment Process route
router.delete("/:id", deleteTreatmentProcessController);

module.exports = router;

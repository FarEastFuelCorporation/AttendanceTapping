// routes/typeOfWasteRoutes.js

const express = require("express");
const router = express.Router();
const {
  getTypeOfWastesController,
  createTypeOfWasteController,
  updateTypeOfWasteController,
  deleteTypeOfWasteController,
} = require("../controllers/typeOfWasteController");

// Create Type Of Waste route
router.post("/", createTypeOfWasteController);

// Get Type Of Waste route
router.get("/", getTypeOfWastesController);

// Update Type Of Waste route
router.put("/:id", updateTypeOfWasteController);

// Delete Type Of Waste route
router.delete("/:id", deleteTypeOfWasteController);

module.exports = router;

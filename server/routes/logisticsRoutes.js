// routes/logisticsRoutes.js

const express = require("express");
const router = express.Router();
const {
  createLogisticsController,
  getLogisticsController,
  updateLogisticsController,
  deleteLogisticsController,
} = require("../controllers/logisticsController");

// Create Third Party Logistics route
router.post("/", createLogisticsController);

// Get Third Party Logistics route
router.get("/", getLogisticsController);

// Update Third Party Logistics route
router.put("/:id", updateLogisticsController);

// Delete Third Party Logistics route
router.delete("/:id", deleteLogisticsController);

module.exports = router;

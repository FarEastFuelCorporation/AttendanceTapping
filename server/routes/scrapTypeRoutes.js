// routes/scrapTypeRoutes.js

const express = require("express");
const router = express.Router();
const {
  createScrapTypeController,
  getScrapTypesController,
  updateScrapTypeController,
  deleteScrapTypeController,
} = require("../controllers/scrapTypeController");

// Create Scrap Type route
router.post("/", createScrapTypeController);

// Get Scrap Types route
router.get("/", getScrapTypesController);

// Update Scrap Type route
router.put("/:id", updateScrapTypeController);

// Delete Scrap Type route
router.delete("/:id", deleteScrapTypeController);

module.exports = router;

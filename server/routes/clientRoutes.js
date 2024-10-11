// routes/clientRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createClientController,
  getClientsController,
  getClientController,
  updateClientController,
  deleteClientController,
} = require("../controllers/clientController");

// Create Client route
router.post("/", upload.single("clientPicture"), createClientController);

// Get Clients route
router.get("/", getClientsController);

// Get Clients route
router.get("/:id", getClientController);

// Update Client route
router.put("/:id", upload.single("clientPicture"), updateClientController);

// Delete Client route
router.delete("/:id", deleteClientController);

module.exports = router;

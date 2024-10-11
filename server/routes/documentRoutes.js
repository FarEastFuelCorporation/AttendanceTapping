// routes/documentRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createDocumentController,
  getDocumentsController,
  getDocumentFileController,
  updateDocumentController,
  deleteDocumentsController,
} = require("../controllers/documentController");

// Create Document route
router.post("/", upload.single("attachment"), createDocumentController);

// Get Documents route
router.get("/", getDocumentsController);

// Get Document file content by ID
router.get("/:id", getDocumentFileController);

// Update Client route
router.put("/:id", upload.single("attachment"), updateDocumentController);

// Delete Document route
router.delete("/:id", deleteDocumentsController);

module.exports = router;

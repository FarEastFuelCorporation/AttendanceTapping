// routes/employeeAttachmentRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createEmployeeAttachmentController,
  getEmployeeAttachmentsController,
  getEmployeeAttachmentController,
} = require("../controllers/employeeAttachmentController");

// Create Employee Attachment route
router.post(
  "/",
  upload.single("attachment"),
  createEmployeeAttachmentController
);

// Get Employee Attachments route
router.get("/", getEmployeeAttachmentsController);

// Get Employee Attachment route
router.get("/:id", getEmployeeAttachmentController);

module.exports = router;

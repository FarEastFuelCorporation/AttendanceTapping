// controllers/employeeAttachmentController.js

const Employee = require("../models/Employee");
const EmployeeAttachment = require("../models/EmployeeAttachment");

// Create Employee Attachment controller
async function createEmployeeAttachmentController(req, res) {
  try {
    // Extracting data from the request body
    let { bookedTransactionId, fileName, createdBy } = req.body;
    console.log(req.body);

    if (fileName) {
      fileName = fileName.toUpperCase();
    }
    console.log(req.file);
    let attachment = null;
    if (req.file) {
      attachment = req.file.buffer;
    }

    // Create Attachment entry
    const newAttachmentData = await EmployeeAttachment.create({
      bookedTransactionId,
      fileName,
      attachment,
      createdBy,
    });

    // Retrieve the newAttachment with the associated Employee data
    const newAttachment = await EmployeeAttachment.findByPk(
      newAttachmentData.id,
      {
        include: [
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"], // Include only necessary fields
          },
        ],
      }
    );
    // Respond with the updated data
    res.status(201).json({ newAttachment });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee Attachments controller
async function getEmployeeAttachmentsController(req, res) {
  try {
    // Fetch all Employee Attachments from the database
    const employeeAttachments = await EmployeeAttachment.findAll();

    res.json({ employeeAttachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employee Attachment controller
async function getEmployeeAttachmentController(req, res) {
  try {
    const employeeId = req.params.id;
    // Fetch Employee Attachment from the database
    const employeeAttachments = await EmployeeAttachment.findAll({
      where: { employeeId },
    });

    res.json({ employeeAttachments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createEmployeeAttachmentController,
  getEmployeeAttachmentsController,
  getEmployeeAttachmentController,
};

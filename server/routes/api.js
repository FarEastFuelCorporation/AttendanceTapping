// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes
const authRoutes = require("./auth");
const othersRoutes = require("./others");
const attendanceRoutes = require("./attendanceRoutes");
const switchUserRoutes = require("./switchUserRoutes");
const geoTableRoutes = require("./geoTableRoutes");
const requestsRoutes = require("./requests");
const clientRoutes = require("./clientRoutes");
const documentRoutes = require("./documentRoutes");
const logisticsRoutes = require("./logisticsRoutes");
const quotationRoutes = require("./quotationRoutes");
const quotationFormRoutes = require("./quotationFormRoutes");
const typeOfWasteRoutes = require("./typeOfWasteRoutes");
const treatmentProcessRoutes = require("./treatmentProcessRoutes");
const vehicleTypeRoutes = require("./vehicleTypeRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const vehicleMaintenanceRequestRoutes = require("./vehicleMaintenanceRequestRoutes");
const scrapTypeRoutes = require("./scrapTypeRoutes");
const treatmentMachineRoutes = require("./treatmentMachineRoutes");
const attachmentRoutes = require("./attachmentRoutes");
const bookedTransactionRoutes = require("./bookedTransactionRoutes");
const scheduledTransactionRoutes = require("./scheduledTransactionRoutes");
const dispatchedTransactionRoutes = require("./dispatchedTransactionRoutes");
const receivedTransactionRoutes = require("./receivedTransactionRoutes");
const sortedTransactionRoutes = require("./sortedTransactionRoutes");
const warehousedTransactionRoutes = require("./warehousedTransactionRoutes");
const treatedTransactionRoutes = require("./treatedTransactionRoutes");
const certifiedTransactionRoutes = require("./certifiedTransactionRoutes");
const certificateRoutes = require("./certificateRoutes");
const plasticTransactionRoutes = require("./plasticTransactionRoutes");
const billedTransactionRoutes = require("./billedTransactionRoutes");
const billingRoutes = require("./billingRoutes");
const billingApprovalTransactionRoutes = require("./billingApprovalTransactionRoutes");
const billingDistributionTransactionRoutes = require("./billingDistributionTransactionRoutes");
const collectionTransactionRoutes = require("./collectionTransactionRoutes");
const hrDashboardRoutes = require("./hr_dashboard");
const employeeRoutes = require("./employeeRoutes");
const employeeRecordRoutes = require("./employeeRecordRoutes");
const employeeAttachmentRoutes = require("./employeeAttachmentRoutes");
const departmentRoutes = require("./departmentRoutes");
const { error404Controller } = require("../controllers/othersController");

// Route to check authentication status
router.get("/session", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.use(authRoutes);
router.use(othersRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/switchUser", switchUserRoutes);
router.use("/geoTable", geoTableRoutes);
router.use("/request", requestsRoutes);
router.use("/client", clientRoutes);
router.use("/document", documentRoutes);
router.use("/logistics", logisticsRoutes);
router.use("/quotation", quotationRoutes);
router.use("/quotationForm", quotationFormRoutes);
router.use("/typeOfWaste", typeOfWasteRoutes);
router.use("/treatmentProcess", treatmentProcessRoutes);
router.use("/vehicleType", vehicleTypeRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/vehicleMaintenanceRequest", vehicleMaintenanceRequestRoutes);
router.use("/scrapType", scrapTypeRoutes);
router.use("/treatmentMachine", treatmentMachineRoutes);
router.use("/attachment", attachmentRoutes);
router.use("/bookedTransaction", bookedTransactionRoutes);
router.use("/scheduledTransaction", scheduledTransactionRoutes);
router.use("/dispatchedTransaction", dispatchedTransactionRoutes);
router.use("/receivedTransaction", receivedTransactionRoutes);
router.use("/sortedTransaction", sortedTransactionRoutes);
router.use("/warehousedTransaction", warehousedTransactionRoutes);
router.use("/treatedTransaction", treatedTransactionRoutes);
router.use("/certifiedTransaction", certifiedTransactionRoutes);
router.use("/certificate", certificateRoutes);
router.use("/plasticTransaction", plasticTransactionRoutes);
router.use("/billedTransaction", billedTransactionRoutes);
router.use("/billing", billingRoutes);
router.use("/billingApprovalTransaction", billingApprovalTransactionRoutes);
router.use(
  "/billingDistributionTransaction",
  billingDistributionTransactionRoutes
);
router.use("/collectionTransaction", collectionTransactionRoutes);
router.use("/hrDashboard", hrDashboardRoutes);
router.use("/employee", employeeRoutes);
router.use("/employeeRecord", employeeRecordRoutes);
router.use("/employeeAttachment", employeeAttachmentRoutes);
router.use("/department", departmentRoutes);

router.use(error404Controller);

module.exports = router;

// controllers/certifiedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const generateCertificateNumber = require("../utils/generateCertificateNumber");
const { fetchData } = require("../utils/getBookedTransactions");
const transactionStatusId = 6;

// Create Certified Transaction controller
async function createCertifiedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      sortedTransactionId,
      certifiedDate,
      certifiedTime,
      typeOfCertificate,
      typeOfWeight,
      remarks,
      statusId,
      createdBy,
    } = req.body;
    console.log(req.body);
    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    const certificateNumber = await generateCertificateNumber();

    // Create CertifiedTransaction entry
    await CertifiedTransaction.create(
      {
        bookedTransactionId,
        sortedTransactionId,
        certificateNumber,
        certifiedDate,
        certifiedTime,
        typeOfCertificate,
        typeOfWeight,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );
    // Adding treated wastes to TreatedWasteTransaction table

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      { transaction }
    );
    if (updatedBookedTransaction) {
      updatedBookedTransaction.statusId = statusId;
      await updatedBookedTransaction.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If booked transaction with the specified ID was not found
      await transaction.rollback();
      res.status(404).json({
        message: `Booked Transaction with ID ${bookedTransactionId} not found`,
      });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Certified Transactions controller
async function getCertifiedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(transactionStatusId);

    // Respond with the updated data
    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Certified Transaction controller
async function updateCertifiedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating certified transaction with ID:", id);

    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      // Extracting data from the request body
      const {
        bookedTransactionId,
        sortedTransactionId,
        certifiedDate,
        certifiedTime,
        typeOfCertificate,
        typeOfWeight,
        remarks,
        statusId,
        createdBy,
      } = req.body;

      // Uppercase the remarks if present
      const updatedRemarks = remarks ? remarks.toUpperCase() : null;

      // Find the certified transaction by UUID (id)
      const certifiedTransaction = await CertifiedTransaction.findByPk(id);

      if (certifiedTransaction) {
        // Update certified transaction attributes
        certifiedTransaction.bookedTransactionId = bookedTransactionId;
        certifiedTransaction.sortedTransactionId = sortedTransactionId;
        certifiedTransaction.certifiedDate = certifiedDate;
        certifiedTransaction.certifiedTime = certifiedTime;
        certifiedTransaction.typeOfCertificate = typeOfCertificate;
        certifiedTransaction.typeOfWeight = typeOfWeight;
        certifiedTransaction.remarks = updatedRemarks;
        certifiedTransaction.statusId = statusId;
        certifiedTransaction.updatedBy = createdBy;

        // Save the updated certified transaction
        await certifiedTransaction.save({ transaction });

        // Fetch updated data after the save operation (you may want to modify this)
        const data = await fetchData(statusId);

        // Commit the transaction
        await transaction.commit();

        // Respond with the updated data
        res.status(200).json({
          pendingTransactions: data.pending,
          inProgressTransactions: data.inProgress,
          finishedTransactions: data.finished,
        });
      } else {
        // If certified transaction with the specified ID was not found
        await transaction.rollback();
        res
          .status(404)
          .json({ message: `Certified Transaction with ID ${id} not found` });
      }
    } catch (error) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      console.error("Error updating certified transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Certified Transaction controller
async function deleteCertifiedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting certified transaction with ID:", id);

    // Find the certified transaction by UUID (id)
    const certifiedTransactionToDelete = await CertifiedTransaction.findByPk(
      id
    );

    if (certifiedTransactionToDelete) {
      // Update the deletedBy field
      certifiedTransactionToDelete.updatedBy = deletedBy;
      certifiedTransactionToDelete.deletedBy = deletedBy;
      await certifiedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 6;

      await updatedBookedTransaction.save();

      // Soft delete the certified transaction (sets deletedAt timestamp)
      await certifiedTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If certified transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Certified Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting certified transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createCertifiedTransactionController,
  getCertifiedTransactionsController,
  updateCertifiedTransactionController,
  deleteCertifiedTransactionController,
};

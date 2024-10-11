// controllers/billedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const BilledTransaction = require("../models/BilledTransaction");
const generateBillingNumber = require("../utils/generateBillingNumber");
const { fetchData } = require("../utils/getBookedTransactions");
const BilledCertified = require("../models/BilledCertified");
const transactionStatusId = 7;

// Create Billed Transaction controller
async function createBilledTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      certifiedTransactionId, // Expecting an array of CertifiedTransaction IDs
      billedDate,
      billedTime,
      serviceInvoiceNumber,
      billedAmount,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    const billingNumber = await generateBillingNumber();

    // Create BilledTransaction entry
    const billedTransaction = await BilledTransaction.create(
      {
        bookedTransactionId,
        billingNumber,
        billedDate,
        billedTime,
        serviceInvoiceNumber,
        billedAmount,
        remarks,
        createdBy,
      },
      { transaction }
    );

    // Link CertifiedTransactions with the newly created BilledTransaction using BilledCertified
    if (certifiedTransactionId && certifiedTransactionId.length > 0) {
      // Create entries in the BilledCertified join table
      const billedCertified = await Promise.all(
        certifiedTransactionId.map(async (certifiedId) => {
          await BilledCertified.create(
            {
              billedTransactionId: billedTransaction.id,
              certifiedTransactionId: certifiedId,
            },
            { transaction }
          );
        })
      );
      console.log("billedCertified", billedCertified);
    }

    // Update the status of the booked transaction
    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      { transaction }
    );

    if (updatedBookedTransaction) {
      updatedBookedTransaction.statusId = statusId;
      await updatedBookedTransaction.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      // Fetch updated transaction data
      const data = await fetchData(statusId);

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

// Get Billed Transactions controller
async function getBilledTransactionsController(req, res) {
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

// Update Billed Transaction controller
async function updateBilledTransactionController(req, res) {
  try {
    const id = req.params.id; // Expecting the BilledTransaction ID to update
    console.log("Updating billed transaction with ID:", id);

    const transaction = await sequelize.transaction(); // Start a transaction

    try {
      // Extracting data from the request body
      let {
        bookedTransactionId,
        certifiedTransactionId, // Array of CertifiedTransaction IDs
        billedDate,
        billedTime,
        serviceInvoiceNumber,
        billedAmount,
        remarks,
        statusId,
        updatedBy,
      } = req.body;

      // Uppercase the remarks if present
      const updatedRemarks = remarks ? remarks.toUpperCase() : null;

      // Find the billed transaction by UUID (id)
      const billedTransaction = await BilledTransaction.findByPk(id);

      if (billedTransaction) {
        // Update billed transaction attributes
        billedTransaction.billedDate = billedDate;
        billedTransaction.billedTime = billedTime;
        billedTransaction.serviceInvoiceNumber = serviceInvoiceNumber;
        billedTransaction.billedAmount = billedAmount;
        billedTransaction.remarks = updatedRemarks;
        billedTransaction.updatedBy = updatedBy;

        // Save the updated billed transaction
        await billedTransaction.save({ transaction });

        // Update the linked CertifiedTransactions in BilledCertified join table
        if (certifiedTransactionId && certifiedTransactionId.length > 0) {
          // Remove existing BilledCertified entries for this billedTransactionId
          await BilledCertified.destroy({
            where: { billedTransactionId: billedTransaction.id },
            transaction,
          });

          // Re-link the CertifiedTransactions
          await Promise.all(
            certifiedTransactionId.map(async (certifiedId) => {
              await BilledCertified.create(
                {
                  billedTransactionId: billedTransaction.id,
                  certifiedTransactionId: certifiedId,
                },
                { transaction }
              );
            })
          );
        }

        // Update the status of the booked transaction
        const updatedBookedTransaction = await BookedTransaction.findByPk(
          bookedTransactionId,
          { transaction }
        );

        if (updatedBookedTransaction) {
          updatedBookedTransaction.statusId = statusId;
          await updatedBookedTransaction.save({ transaction });

          // Commit the transaction
          await transaction.commit();

          // Fetch updated transaction data
          const data = await fetchData(statusId);

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
      } else {
        // If billed transaction with the specified ID was not found
        await transaction.rollback();
        res
          .status(404)
          .json({ message: `Billed Transaction with ID ${id} not found` });
      }
    } catch (error) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      console.error("Error updating billed transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Billed Transaction controller
async function deleteBilledTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting billed transaction with ID:", id);

    // Find the billed transaction by UUID (id)
    const treatedWasteTransactionToDelete = await BilledTransaction.findByPk(
      id
    );

    if (treatedWasteTransactionToDelete) {
      // Update the deletedBy field
      treatedWasteTransactionToDelete.updatedBy = deletedBy;
      treatedWasteTransactionToDelete.deletedBy = deletedBy;
      await treatedWasteTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 7;

      await updatedBookedTransaction.save();

      // Soft delete the billed transaction (sets deletedAt timestamp)
      await treatedWasteTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If billed transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Billed Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting billed transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBilledTransactionController,
  getBilledTransactionsController,
  updateBilledTransactionController,
  deleteBilledTransactionController,
};

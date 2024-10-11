// controllers/billingApprovalTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const BillingApprovalTransaction = require("../models/BillingApprovalTransaction");
const transactionStatusId = 8;

// Create Billing Approval Transaction controller
async function createBillingApprovalTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      billedTransactionId,
      approvedDate,
      approvedTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Create BillingApprovalTransaction entry
    await BillingApprovalTransaction.create(
      {
        bookedTransactionId,
        billedTransactionId,
        approvedDate,
        approvedTime,
        remarks,
        createdBy,
      },
      { transaction }
    );

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

// Get Billing Approval Transactions controller
async function getBillingApprovalTransactionsController(req, res) {
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

// Update Billing Approval Transaction controller
async function updateBillingApprovalTransactionController(req, res) {
  const id = req.params.id; // Expecting the BilledTransaction ID to update
  console.log("Updating billing approval transaction with ID:", id);

  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      billedTransactionId,
      approvedDate,
      approvedTime,
      remarks,
      statusId,
      updatedBy,
    } = req.body;

    console.log("req.body", req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the billing approval transaction by its billedTransactionId
    const billingApprovalTransaction =
      await BillingApprovalTransaction.findByPk(id, { transaction });

    if (billingApprovalTransaction) {
      // Update the BillingApprovalTransaction fields
      billingApprovalTransaction.approvedDate = approvedDate;
      billingApprovalTransaction.approvedTime = approvedTime;
      billingApprovalTransaction.remarks = remarks;
      billingApprovalTransaction.updatedBy = updatedBy;

      await billingApprovalTransaction.save({ transaction });

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
      res.status(404).json({
        message: `Billing Approval Transaction with ID ${billedTransactionId} not found`,
      });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Billing Approval Transaction controller
async function deleteBillingApprovalTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting Billing Approval transaction with ID:", id);

    // Find the billing approval transaction by UUID (id)
    const billingApprovalTransactionToDelete =
      await BillingApprovalTransaction.findByPk(id);

    if (billingApprovalTransactionToDelete) {
      // Update the deletedBy field
      billingApprovalTransactionToDelete.updatedBy = deletedBy;
      billingApprovalTransactionToDelete.deletedBy = deletedBy;
      await billingApprovalTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 8;

      await updatedBookedTransaction.save();

      // Soft delete the billing approval transaction (sets deletedAt timestamp)
      await billingApprovalTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If billing approval transaction with the specified ID was not found
      res.status(404).json({
        message: `Billing Approval Transaction with ID ${id} not found`,
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting billing approval transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBillingApprovalTransactionController,
  getBillingApprovalTransactionsController,
  updateBillingApprovalTransactionController,
  deleteBillingApprovalTransactionController,
};

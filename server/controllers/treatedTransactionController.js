// controllers/treatedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const SortedTransaction = require("../models/SortedTransaction");
const TreatedTransaction = require("../models/TreatedTransaction");
const TreatedWasteTransaction = require("../models/TreatedWasteTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const transactionStatusId = 5;

// Create Treated Transaction controller
async function createTreatedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      isFinished,
      bookedTransactionId,
      sortedTransactionId,
      sortedWasteTransactionId,
      treatedWastes,
      remarks,
      statusId,
      createdBy,
    } = req.body;
    console.log("logger:" + req.body);
    if (remarks) {
      remarks = remarks.toUpperCase();
    }
    // Create TreatedTransaction entry
    const newTreatedTransaction = await TreatedTransaction.create(
      {
        sortedTransactionId,
        isFinished,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );
    // Adding treated wastes to TreatedWasteTransaction table
    if (treatedWastes && treatedWastes.length > 0) {
      const treatedWastePromises = treatedWastes.map((waste) => {
        return TreatedWasteTransaction.create(
          {
            treatedTransactionId: newTreatedTransaction.id,
            sortedWasteTransactionId,
            treatmentProcessId: waste.treatmentProcessId,
            treatmentMachineId: waste.treatmentMachineId,
            weight: waste.weight,
            treatedDate: waste.treatedDate,
            treatedTime: waste.treatedTime,
          },
          { transaction: transaction }
        );
      });
      await Promise.all(treatedWastePromises);
    }

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      { transaction }
    );

    const sortedTransactionToUpdate = await SortedTransaction.findByPk(
      sortedTransactionId,
      { transaction }
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes if isFinished is true
      if (isFinished) {
        updatedBookedTransaction.statusId = statusId;
        await updatedBookedTransaction.save({ transaction });

        sortedTransactionToUpdate.isFinishTreated = isFinished;
        await sortedTransactionToUpdate.save({ transaction });
      }
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

// Get Treated Transactions controller
async function getTreatedTransactionsController(req, res) {
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

// Delete Treated Transaction controller
async function deleteTreatedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);
    console.log("Soft deleting sorted transaction with ID:", id);

    // Find the treated waste transaction by UUID (id)
    const treatedWasteTransactionToDelete =
      await TreatedWasteTransaction.findByPk(id);

    if (!treatedWasteTransactionToDelete) {
      return res
        .status(404)
        .json({ message: `Treated Waste Transaction with ID ${id} not found` });
    }

    // Find the associated treated transaction
    const treatedTransactionToDelete = await TreatedTransaction.findByPk(
      treatedWasteTransactionToDelete.treatedTransactionId
    );

    if (!treatedTransactionToDelete) {
      return res.status(404).json({ message: `Treated Transaction not found` });
    }

    // Find the associated sorted transaction
    const sortedTransactionToUpdate = await SortedTransaction.findByPk(
      treatedTransactionToDelete.sortedTransactionId
    );

    if (!sortedTransactionToUpdate) {
      return res.status(404).json({ message: `Sorted Transaction not found` });
    }

    // Find other TreatedWasteTransaction records associated with this treated transaction
    const otherTreatedWasteTransactions = await TreatedWasteTransaction.findAll(
      {
        where: { treatedTransactionId: treatedTransactionToDelete.id },
      }
    );

    // Soft delete logic
    if (otherTreatedWasteTransactions.length === 1) {
      // This means there is no other associated TreatedWasteTransaction, so we can delete the TreatedTransaction
      treatedTransactionToDelete.updatedBy = deletedBy;
      treatedTransactionToDelete.deletedBy = deletedBy;
      await treatedTransactionToDelete.save();

      // Update the sorted transaction's isFinished status
      sortedTransactionToUpdate.isFinished = false;
      await sortedTransactionToUpdate.save();

      // Soft delete the TreatedTransaction
      await treatedTransactionToDelete.destroy();
    }

    // Update the booked transaction status
    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId
    );

    updatedBookedTransaction.statusId = 5;
    await updatedBookedTransaction.save();

    // Soft delete the TreatedWasteTransaction
    await treatedWasteTransactionToDelete.destroy();

    // Fetch transactions
    const data = await fetchData(transactionStatusId);

    // Respond with the updated data
    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting sorted transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createTreatedTransactionController,
  getTreatedTransactionsController,
  deleteTreatedTransactionController,
};

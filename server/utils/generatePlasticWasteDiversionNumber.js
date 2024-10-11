// utils/generatePlasticWasteDiversionNumber

const PlasticTransaction = require("../models/PlasticTransaction");

async function generatePlasticWasteDiversionNumber(volume) {
  try {
    // Get the current year, month, and day
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString().slice(-2); // Last two digits of the year
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Two-digit month
    const currentDay = currentDate.getDate().toString().padStart(2, "0"); // Two-digit day

    // Find the latest transaction ID
    const latestTransaction = await PlasticTransaction.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false, // Include soft-deleted records
    });

    // Initialize transaction counter
    let newTransactionCounter = 1;

    // Check if a transaction exists
    if (latestTransaction) {
      const latestTransactionId = latestTransaction.certificateNumber;

      // Split the latest transaction ID by '-'
      const parts = latestTransactionId.split("-");

      // Get the datePart (the fourth part in the split)
      const datePart = parts[3]; // "241009001"

      // Extract the existing counter from datePart
      const existingCounter = parseInt(datePart.substring(6, 9), 10); // "001"

      // If the latest transaction is from today, increment the transaction counter
      if (datePart.startsWith(`${currentYear}${currentMonth}${currentDay}`)) {
        newTransactionCounter = existingCounter + 1;
      }
    }

    // Format the transaction counter with leading zeros
    const transactionCounterString = newTransactionCounter
      .toString()
      .padStart(3, "0");

    // Format the volume with leading zeros and append 'KGS'
    const volumeString = volume.toString().padStart(6, "0") + "KGS";

    // Construct the new transaction ID in the format: FEFC-PCC-IP-YYMMDDCCC-######KGS
    const newTransactionId = `FEFC-PWDC-IP-${currentYear}${currentMonth}${currentDay}${transactionCounterString}-${volumeString}`;

    return newTransactionId;
  } catch (error) {
    console.error("Error generating transaction ID:", error);
    throw error;
  }
}

module.exports = generatePlasticWasteDiversionNumber;

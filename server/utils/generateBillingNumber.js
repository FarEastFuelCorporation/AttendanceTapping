// utils/generateCertificateNumber

const BilledTransaction = require("../models/BilledTransaction");

async function generateBillingNumber() {
  try {
    // Get the current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString().slice(-2); // Get last two digits of the year
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Ensure month is 2 digits (e.g., '09')

    // Find the latest transaction ID with the specified prefix
    const latestTransaction = await BilledTransaction.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false, // Include soft-deleted records
    });

    // Generate the new transaction ID
    let newIdNumber = 1;
    if (latestTransaction) {
      const latestTransactionId = latestTransaction.transactionId;
      const latestYear = latestTransactionId.substring(1, 3); // Get last two digits of the year
      const latestMonth = latestTransactionId.substring(4, 6); // Get the month
      if (latestYear === currentYear && latestMonth === currentMonth) {
        const latestIdNumber = parseInt(latestTransactionId.substring(7), 10); // Get the ID number part
        newIdNumber = latestIdNumber + 1;
      }
    }

    // Pad the ID number with leading zeros
    const newIdString = newIdNumber.toString().padStart(3, "0");
    const newTransactionId = `B${currentYear}-${currentMonth}-${newIdString}`; // Format as BYY-MM-XXX

    return newTransactionId;
  } catch (error) {
    console.error("Error generating billing number:", error);
    throw error;
  }
}

module.exports = generateBillingNumber;

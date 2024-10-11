// controllers/billingController.js

const BilledTransaction = require("../models/BilledTransaction");
const BookedTransaction = require("../models/BookedTransaction");
const { getIncludeOptions } = require("../utils/getBookedTransactions");

// Get Billing controller
async function getBillingController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const billedTransaction = await BilledTransaction.findByPk(id, {
      include: {
        model: BookedTransaction,
        as: "BookedTransaction",
        include: getIncludeOptions(),
      },
    });

    res.json({ billedTransaction });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getBillingController,
};

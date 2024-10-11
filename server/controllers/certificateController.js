// controllers/certificateController.js

const BookedTransaction = require("../models/BookedTransaction");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const Client = require("../models/Client");
const PlasticTransaction = require("../models/PlasticTransaction");
const { getIncludeOptions } = require("../utils/getBookedTransactions");

// Get Certificate of Destruction controller
async function getCertificateController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const certifiedTransaction = await CertifiedTransaction.findByPk(id, {
      include: {
        model: BookedTransaction,
        as: "BookedTransaction",
        include: getIncludeOptions(),
      },
    });

    res.json({ certifiedTransaction });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Plastic Certificate controller
async function getPlasticCertificateController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    const plasticTransaction = await PlasticTransaction.findByPk(id, {
      include: {
        model: Client,
        as: "Client",
      },
    });

    if (!plasticTransaction) {
      return res.status(404).send("Plastic transaction not found");
    }

    res.json({ plasticTransaction });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getCertificateController,
  getPlasticCertificateController,
};

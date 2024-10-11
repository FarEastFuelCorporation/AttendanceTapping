// utils/getBookedTransactions

const { Op } = require("sequelize"); // Import Sequelize operators
const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const VehicleType = require("../models/VehicleType");
const Vehicle = require("../models/Vehicle");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const SortedTransaction = require("../models/SortedTransaction");
const SortedWasteTransaction = require("../models/SortedWasteTransaction");
const SortedScrapTransaction = require("../models/SortedScrapTransaction");
const ScrapType = require("../models/ScrapType");
const TreatedTransaction = require("../models/TreatedTransaction");
const TreatedWasteTransaction = require("../models/TreatedWasteTransaction");
const TreatmentProcess = require("../models/TreatmentProcess");
const TreatmentMachine = require("../models/TreatmentMachine");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const Attachment = require("../models/Attachment");
const BilledTransaction = require("../models/BilledTransaction");
const BillingApprovalTransaction = require("../models/BillingApprovalTransaction");
const CollectedTransaction = require("../models/CollectedTransaction");
const Quotation = require("../models/Quotation");
const BillingDistributionTransaction = require("../models/BillingDistributionTransaction");

// Reusable include structure for both functions
const getIncludeOptions = () => [
  {
    model: QuotationWaste,
    as: "QuotationWaste",
    include: [
      {
        model: TypeOfWaste,
        as: "TypeOfWaste",
        attributes: ["wasteCode"],
      },
      {
        model: Quotation,
        as: "Quotation",
      },
    ],
  },
  {
    model: QuotationTransportation,
    as: "QuotationTransportation",
    include: [
      {
        model: VehicleType,
        as: "VehicleType",
        attributes: ["typeOfVehicle"],
      },
    ],
  },
  {
    model: Client,
    as: "Client",
  },
  {
    model: Attachment,
    as: "Attachment",
    required: false,
    include: {
      model: Employee,
      as: "Employee",
      attributes: ["firstName", "lastName"],
    },
  },
  {
    model: ScheduledTransaction,
    as: "ScheduledTransaction",
    required: false,
    include: [
      {
        model: DispatchedTransaction,
        as: "DispatchedTransaction",
        required: false,
        include: [
          {
            model: Employee,
            as: "EmployeeDriver",
            attributes: ["firstName", "lastName"],
          },
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
          {
            model: Vehicle,
            as: "Vehicle",
            attributes: ["plateNumber"],
            include: {
              model: VehicleType,
              as: "VehicleType",
              attributes: ["typeOfVehicle"],
            },
          },
        ],
      },
      {
        model: ReceivedTransaction,
        as: "ReceivedTransaction",
        required: false,
        include: [
          {
            model: SortedTransaction,
            as: "SortedTransaction",
            required: false,
            paranoid: true,
            include: [
              {
                model: SortedWasteTransaction,
                as: "SortedWasteTransaction",
                required: false,
                include: [
                  {
                    model: QuotationWaste,
                    as: "QuotationWaste",
                  },
                  {
                    model: TreatedWasteTransaction,
                    as: "TreatedWasteTransaction",
                    required: false,
                    include: [
                      {
                        model: TreatmentMachine,
                        as: "TreatmentMachine",
                        required: false,
                        include: [
                          {
                            model: TreatmentProcess,
                            as: "TreatmentProcess",
                            required: false,
                          },
                        ],
                      },
                      {
                        model: TreatedTransaction,
                        as: "TreatedTransaction",
                        required: false,
                        paranoid: true,
                        include: {
                          model: Employee,
                          as: "Employee",
                          attributes: ["firstName", "lastName"],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                model: SortedScrapTransaction,
                as: "SortedScrapTransaction",
                required: false,
                include: {
                  model: ScrapType,
                  as: "ScrapType",
                  required: false,
                },
              },
              {
                model: TreatedTransaction,
                as: "TreatedTransaction",
                required: false,
                paranoid: true,
              },
              {
                model: CertifiedTransaction,
                as: "CertifiedTransaction",
                required: false,
                include: [
                  {
                    model: BilledTransaction,
                    as: "BilledTransaction",
                    required: false,
                    include: [
                      {
                        model: BillingApprovalTransaction,
                        as: "BillingApprovalTransaction",
                        required: false,
                        include: [
                          {
                            model: BillingDistributionTransaction,
                            as: "BillingDistributionTransaction",
                            required: false,
                            include: [
                              {
                                model: CollectedTransaction,
                                as: "CollectedTransaction",
                                required: false,
                                include: [
                                  {
                                    model: Employee,
                                    as: "Employee",
                                    attributes: ["firstName", "lastName"],
                                  },
                                ],
                              },
                              {
                                model: Employee,
                                as: "Employee",
                                attributes: ["firstName", "lastName"],
                              },
                            ],
                          },
                          {
                            model: Employee,
                            as: "Employee",
                            attributes: ["firstName", "lastName"],
                          },
                        ],
                      },
                      {
                        model: Employee,
                        as: "Employee",
                        attributes: ["firstName", "lastName"],
                      },
                    ],
                  },
                  {
                    model: Employee,
                    as: "Employee",
                    attributes: ["firstName", "lastName"],
                  },
                ],
              },
              {
                model: Employee,
                as: "Employee",
                attributes: ["firstName", "lastName"],
              },
            ],
          },
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
        ],
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],
  },
];

// Get Pending Transactions (where statusId equals given value)
const getPendingTransactions = async (statusId, user = null) => {
  try {
    // Build the where clause dynamically
    const whereConditions = { statusId }; // Always include statusId

    // If user is provided, add user-specific condition (e.g., createdBy)
    if (user) {
      whereConditions.createdBy = user;
    }
    const bookedTransactions = await BookedTransaction.findAll({
      where: whereConditions,
      include: getIncludeOptions(),
      order: [["transactionId", "DESC"]],
    });

    return bookedTransactions;
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

// Get In Progress Transactions (where statusId is greater than given value)
const getInProgressTransactions = async (statusId, user = null) => {
  try {
    // Build the base where conditions
    const whereConditions = {
      statusId: {
        [Op.gt]: statusId, // Status ID greater than the given value
      },
    };

    // If user is provided, add the condition for createdBy (or whatever the user field is)
    if (user) {
      whereConditions.createdBy = user;
    }
    const bookedTransactions = await BookedTransaction.findAll({
      where: whereConditions,
      include: getIncludeOptions(),
      order: [["transactionId", "DESC"]],
    });

    return bookedTransactions;
  } catch (error) {
    console.error("Error fetching in progress transactions:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

// Get In Finished Transactions (where statusId is greater than given value)
const getFinishedTransactions = async (user = null) => {
  try {
    const bookedTransactions = await BookedTransaction.findAll({
      where: {
        statusId: 12,
      },
      include: getIncludeOptions(),
      order: [["transactionId", "DESC"]],
    });

    return bookedTransactions;
  } catch (error) {
    console.error("Error fetching in progress transactions:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

const fetchData = async (statusId, user = null) => {
  try {
    // Fetch all transactions concurrently
    const [pendingTransactions, inProgressTransactions, finishedTransactions] =
      await Promise.all([
        getPendingTransactions(statusId, user),
        getInProgressTransactions(statusId, user),
        getFinishedTransactions(user),
      ]);

    // Return the results as an object or process them as needed
    return {
      pending: pendingTransactions,
      inProgress: inProgressTransactions,
      finished: finishedTransactions,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

module.exports = {
  fetchData,
  getIncludeOptions,
};

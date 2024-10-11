import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const TreatedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    waste: [],
    id: "",
    bookedTransactionId: "",
    sortedWasteTransactionId: "",
    treatedWastes: [
      {
        treatedDate: "",
        treatedTime: "",
        treatmentProcessId: "",
        treatmentMachineId: "",
        weight: 0,
      },
    ],
    remarks: "",
    statusId: 6,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [inProgressTransactions, setInProgressTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const treatedTransactionResponse = await axios.get(
        `${apiUrl}/api/treatedTransaction`
      );

      // For pending transactions
      setPendingTransactions(
        treatedTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        treatedTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        treatedTransactionResponse.data.finishedTransactions
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (row, waste) => {
    setFormData({
      row: row,
      waste: waste,
      isFinished: false,
      id: "",
      bookedTransactionId: row.id,
      sortedTransactionId:
        row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
          .id,
      sortedWasteTransactionId: waste.id,
      treatedWastes: [
        {
          treatedDate: "",
          treatedTime: "",
          treatmentProcessId: "",
          treatmentMachineId: "",
          weight: 0,
        },
      ],
      remarks: "",
      statusId: 6,
      createdBy: user.id,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteClick = async (row) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Treated Waste Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/treatedTransaction/${row.id}`, {
        data: {
          deletedBy: user.id,
          bookedTransactionId: row.id,
        },
      });

      fetchData();

      setSuccessMessage("Treated Waste Transaction Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateForm = () => {
    let validationErrors = [];

    // Validate bookedTransactionId
    if (!formData.bookedTransactionId) {
      validationErrors.push("Booked Transaction ID is required.");
    }

    // Validate sortedWasteTransactionId
    if (!formData.sortedWasteTransactionId) {
      validationErrors.push("Sorted Waste Transaction ID is required.");
    }

    // Validate treatedWastes
    if (!formData.treatedWastes || formData.treatedWastes.length === 0) {
      validationErrors.push("At least one treated waste entry is required.");
    } else {
      formData.treatedWastes.forEach((waste, index) => {
        if (!waste.treatmentProcessId) {
          validationErrors.push(
            `Treatment Process is required for waste entry #${index + 1}.`
          );
        }
        if (!waste.treatmentMachineId) {
          validationErrors.push(
            `Treatment Machine is required for waste entry #${index + 1}.`
          );
        }
        if (!waste.treatedDate) {
          validationErrors.push(
            `Treated Date is required for waste entry #${index + 1}.`
          );
        }
        if (!waste.treatedTime) {
          validationErrors.push(
            `Treated Time is required for waste entry #${index + 1}.`
          );
        }
        if (waste.weight <= 0) {
          validationErrors.push(
            `Weight must be greater than zero for waste entry #${index + 1}.`
          );
        }
      });
    }

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(" "));
      setShowErrorMessage(true);
      return false;
    }

    setShowErrorMessage(false);
    setErrorMessage("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Perform client-side validation
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updatedFormData = updateIsFinished(formData);

      if (!formData.id) {
        await axios.post(`${apiUrl}/api/treatedTransaction`, updatedFormData);
        setSuccessMessage("Treated Transaction Submitted Successfully!");
      }

      fetchData();

      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const updateIsFinished = (formData) => {
  //   const updatedFormData = { ...formData };

  //   // Calculate total treated weight from treatedWastes array
  //   let totalTreatedWeight = formData.treatedWastes.reduce(
  //     (total, waste) => total + parseFloat(waste.weight || 0),
  //     0
  //   );

  //   totalTreatedWeight += formData.waste.treatedWeight;

  //   // Update sortedWasteTransaction with the total treated weight
  //   if (
  //     updatedFormData.row &&
  //     updatedFormData.row.sortedWasteTransaction &&
  //     updatedFormData.sortedWasteTransactionId
  //   ) {
  //     updatedFormData.row.sortedWasteTransaction =
  //       updatedFormData.row.sortedWasteTransaction.map((item) => {
  //         if (item.id === updatedFormData.sortedWasteTransactionId) {
  //           return {
  //             ...item,
  //             treatedWeight: totalTreatedWeight,
  //           };
  //         }
  //         return item;
  //       });

  //     // Check if all sortedWasteTransaction items are fully treated
  //     const isAllTreated = updatedFormData.row.sortedWasteTransaction.every(
  //       (item) => item.treatedWeight === item.weight
  //     );
  //     updatedFormData.isFinished = isAllTreated;
  //   }

  //   return updatedFormData;
  // };

  const updateIsFinished = (formData) => {
    // Extract relevant data from the formData object
    const scheduledTransaction = formData.row?.ScheduledTransaction?.[0];
    if (!scheduledTransaction) return;

    const dispatchedTransaction =
      scheduledTransaction?.DispatchedTransaction?.[0];
    if (!dispatchedTransaction) return;

    const receivedTransaction = dispatchedTransaction?.ReceivedTransaction?.[0];
    if (!receivedTransaction) return;

    const sortedTransaction = receivedTransaction?.SortedTransaction?.[0];
    if (!sortedTransaction) return;

    // Calculate the total weight from all SortedWasteTransaction objects
    const sortedWasteTransactions =
      sortedTransaction?.SortedWasteTransaction || [];
    const totalSortedWeight = sortedWasteTransactions.reduce(
      (total, wasteTransaction) => {
        // Convert weight to a number and sum it
        return (
          total +
          (wasteTransaction.weight ? Number(wasteTransaction.weight) : 0)
        );
      },
      0
    );

    // Calculate the total treatedWeight from all SortedWasteTransaction objects
    let totalTreatedWeight = sortedWasteTransactions.reduce(
      (total, wasteTransaction) => {
        return (
          total +
          (wasteTransaction.treatedWeight
            ? Number(wasteTransaction.treatedWeight)
            : 0)
        );
      },
      0
    );

    // Also add the weight from treatedWastes array in formData
    const treatedWastes = formData.treatedWastes || [];
    totalTreatedWeight += treatedWastes.reduce((total, treatedWaste) => {
      return total + (treatedWaste.weight ? Number(treatedWaste.weight) : 0);
    }, 0);

    // Update isFinished if totalSortedWeight matches totalTreatedWeight
    const isFinished = totalSortedWeight === totalTreatedWeight;

    // Return the updated formData with the isFinished flag
    return {
      ...formData,
      isFinished,
    };
  };

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Transactions" subtitle="List of Transactions" />
        {user.userType === "GEN" && (
          <Box display="flex">
            <IconButton onClick={handleOpenModal}>
              <PostAddIcon sx={{ fontSize: "40px" }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <Transaction
        user={user}
        buttonText={"Treat"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleDeleteClick={handleDeleteClick}
      />
      <Modal
        user={user}
        open={openModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        showErrorMessage={showErrorMessage}
        setShowErrorMessage={setShowErrorMessage}
      />
    </Box>
  );
};

export default TreatedTransactions;

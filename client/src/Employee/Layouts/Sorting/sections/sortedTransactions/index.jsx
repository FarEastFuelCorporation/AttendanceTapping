import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../HR/sections/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const SortedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    clientId: "",
    bookedTransactionId: "",
    receivedTransactionId: "",
    sortedDate: "",
    sortedTime: "",
    batchWeight: 0,
    totalSortedWeight: 0,
    discrepancyWeight: 0,
    sortedWastes: [
      {
        quotationWasteId: "",
        wasteName: "",
        weight: 0,
        clientWeight: 0,
        formNo: "",
      },
    ],
    sortedScraps: [],
    remarks: "",
    statusId: 5,
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
  const [isDiscrepancy, setIsDiscrepancy] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const sortedTransactionResponse = await axios.get(
        `${apiUrl}/api/sortedTransaction`
      );
      console.log(sortedTransactionResponse.data);

      // Helper function to filter by submitTo "SORTING"
      const filterBySubmitToSorting = (transactions) => {
        return transactions.filter((transaction) => {
          const scheduledTransaction = transaction.ScheduledTransaction?.[0];
          const receivedTransaction =
            scheduledTransaction?.ReceivedTransaction?.[0];
          return receivedTransaction?.submitTo === "SORTING";
        });
      };

      // For pending transactions
      const filteredPendingTransactions = filterBySubmitToSorting(
        sortedTransactionResponse.data.pendingTransactions
      );
      setPendingTransactions(filteredPendingTransactions);

      // For in progress transactions
      const filteredInProgressTransactions = filterBySubmitToSorting(
        sortedTransactionResponse.data.inProgressTransactions
      );
      setInProgressTransactions(filteredInProgressTransactions);

      // For finished transactions
      const filteredFinishedTransactions = filterBySubmitToSorting(
        sortedTransactionResponse.data.finishedTransactions
      );
      setFinishedTransactions(filteredFinishedTransactions);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [apiUrl]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (row) => {
    setFormData({
      id: "",
      clientId: row.Client.clientId,
      bookedTransactionId: row.id,
      receivedTransactionId:
        row.ScheduledTransaction[0].ReceivedTransaction[0].id,
      sortedDate: "",
      sortedTime: "",
      batchWeight: row.ScheduledTransaction[0].ReceivedTransaction[0].netWeight,
      totalSortedWeight: 0,
      discrepancyWeight: 0,
      sortedWastes: [
        {
          quotationWasteId: "",
          wasteName: "",
          weight: 0,
          clientWeight: 0,
          formNo: "",
        },
      ],
      sortedScraps: [],
      remarks: "",
      statusId: 5,
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

  const handleEditClick = (row) => {
    const typeToEdit = inProgressTransactions.find(
      (type) => type.id === row.id
    );

    if (typeToEdit) {
      const sortedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
          .SortedTransaction?.[0] || {};
      setFormData({
        id: sortedTransaction.id,
        clientId: typeToEdit.Client.clientId,
        bookedTransactionId: typeToEdit.id,
        receivedTransactionId:
          typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0].id,
        sortedDate: sortedTransaction.sortedDate,
        sortedTime: sortedTransaction.sortedTime,
        batchWeight:
          typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
            .netWeight,
        totalSortedWeight: sortedTransaction.totalSortedWeight,
        discrepancyWeight: sortedTransaction.discrepancyWeight,
        sortedWastes: sortedTransaction.SortedWasteTransaction
          ? sortedTransaction.SortedWasteTransaction.map((waste) => ({
              quotationWasteId: waste.quotationWasteId || "",
              wasteName: waste.wasteName || "",
              weight: waste.weight || 0,
              clientWeight: waste.clientWeight || 0,
              formNo: waste.formNo || "",
            }))
          : [
              {
                quotationWasteId: "",
                wasteName: "",
                weight: 0,
                clientWeight: 0,
                formNo: "",
              },
            ],
        sortedScraps: sortedTransaction.SortedScrapTransaction
          ? sortedTransaction.SortedScrapTransaction
          : [],
        remarks: sortedTransaction.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(
        `Received Transaction with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = async (row) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Sorted Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/sortedTransaction/${row.ScheduledTransaction[0].ReceivedTransaction?.[0].SortedTransaction?.[0].id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();
      setSuccessMessage("Received Transaction deleted successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Perform client-side validation
    const {
      receivedTransactionId,
      sortedDate,
      sortedTime,
      totalSortedWeight,
      createdBy,
      sortedWastes,
      sortedScraps,
      remarks,
    } = formData;
    if (
      !receivedTransactionId ||
      !sortedDate ||
      !sortedTime ||
      !totalSortedWeight ||
      !createdBy ||
      (sortedWastes &&
        sortedWastes.some(
          (waste) =>
            !waste.weight ||
            !waste.clientWeight ||
            !waste.quotationWasteId ||
            !waste.wasteName
        )) ||
      (sortedScraps &&
        sortedScraps.some((scrap) => !scrap.weight || !scrap.scrapTypeId)) ||
      (isDiscrepancy && !remarks)
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }
    try {
      setLoading(true);
      if (formData.id) {
        await axios.put(
          `${apiUrl}/api/sortedTransaction/${formData.id}`,
          formData
        );

        setSuccessMessage("Sorted Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/sortedTransaction`, formData);

        setSuccessMessage("Sorted Transaction Submitted Successfully!");
      }

      fetchData();

      setShowSuccessMessage(true);
      handleCloseModal();

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
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
        buttonText={"Sort"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
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
        showErrorMessage={showErrorMessage}
        setIsDiscrepancy={setIsDiscrepancy}
        isDiscrepancy={isDiscrepancy}
      />
    </Box>
  );
};

export default SortedTransactions;

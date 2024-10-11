import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const ScheduledTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    logisticsId: "",
    scheduledDate: "",
    scheduledTime: "",
    remarks: "",
    statusId: 2,
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
      const scheduledTransactionResponse = await axios.get(
        `${apiUrl}/api/scheduledTransaction`
      );

      // For pending transactions
      setPendingTransactions(
        scheduledTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        scheduledTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        scheduledTransactionResponse.data.finishedTransactions
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

  const handleOpenModal = (row) => {
    setFormData({
      id: "",
      bookedTransactionId: row.id,
      logisticsId: "",
      scheduledDate: "",
      scheduledTime: "",
      remarks: "",
      statusId: 2,
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
      const scheduledTransaction = typeToEdit.ScheduledTransaction?.[0];

      setFormData({
        id: scheduledTransaction?.id,
        bookedTransactionId: typeToEdit.id,
        logisticsId: scheduledTransaction.logisticsId,
        scheduledDate: scheduledTransaction?.scheduledDate,
        scheduledTime: scheduledTransaction?.scheduledTime,
        remarks: scheduledTransaction?.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(`Vehicle type with ID ${row.id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (row) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Scheduled Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      // Make the delete request
      await axios.delete(
        `${apiUrl}/api/scheduledTransaction/${row.ScheduledTransaction[0].id}`,
        {
          data: { deletedBy: user.id },
        }
      );

      fetchData();

      // Display success message
      setSuccessMessage("Scheduled Transaction Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const { scheduledDate, scheduledTime, statusId, createdBy } = formData;

    if (!scheduledDate || !scheduledTime || !statusId || !createdBy) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        await axios.put(
          `${apiUrl}/api/scheduledTransaction/${formData.id}`,
          formData
        );
        setSuccessMessage("Scheduled Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/scheduledTransaction`, formData);
        setSuccessMessage("Scheduled Transaction Submitted Successfully!");
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
        buttonText={"Schedule"}
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
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
    </Box>
  );
};

export default ScheduledTransactions;

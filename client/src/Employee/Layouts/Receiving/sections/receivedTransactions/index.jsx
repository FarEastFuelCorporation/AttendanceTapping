import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../HR/sections/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const ReceivedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    scheduledTransactionId: "",
    dispatchedTransactionId: "",
    receivedDate: "",
    receivedTime: "",
    pttNo: "",
    manifestNo: "",
    pullOutFormNo: "",
    manifestWeight: 0,
    clientWeight: 0,
    grossWeight: 0,
    tareWeight: 0,
    netWeight: 0,
    remarks: "",
    statusId: 4,
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
      const receivedTransactionResponse = await axios.get(
        `${apiUrl}/api/receivedTransaction`
      );

      // Define the logisticsId to match
      const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

      // For pending transactions
      const filteredPendingTransactions =
        receivedTransactionResponse.data.pendingTransactions.filter(
          (transaction) =>
            (transaction.statusId === 2 &&
              transaction.ScheduledTransaction &&
              transaction.ScheduledTransaction[0].logisticsId !==
                matchingLogisticsId) ||
            transaction.statusId === 3
        );
      setPendingTransactions(filteredPendingTransactions);

      // For in-progress transactions
      const filteredInProgressTransactions =
        receivedTransactionResponse.data.inProgressTransactions.filter(
          (transaction) =>
            (transaction.statusId === 2 &&
              transaction.ScheduledTransaction &&
              transaction.ScheduledTransaction[0].logisticsId !==
                matchingLogisticsId) ||
            transaction.statusId === 3
        );
      setInProgressTransactions(filteredInProgressTransactions);

      // For finished transactions
      const filteredFinishedTransactions =
        receivedTransactionResponse.data.finishedTransactions.filter(
          (transaction) =>
            (transaction.statusId === 2 &&
              transaction.ScheduledTransaction &&
              transaction.ScheduledTransaction[0].logisticsId !==
                matchingLogisticsId) ||
            transaction.statusId === 3
        );
      setFinishedTransactions(filteredFinishedTransactions);
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
      scheduledTransactionId: row.ScheduledTransaction[0].id,
      dispatchedTransactionId: row.ScheduledTransaction[0].id,
      receivedDate: "",
      receivedTime: "",
      pttNo: "",
      manifestNo: "",
      pullOutFormNo: "",
      manifestWeight: 0,
      clientWeight: 0,
      grossWeight: 0,
      tareWeight: 0,
      netWeight: 0,
      remarks: "",
      statusId: 4,
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
      const receivedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0] || {};
      setFormData({
        id: receivedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        scheduledTransactionId: typeToEdit.ScheduledTransaction?.[0]?.id,
        dispatchedTransactionId: typeToEdit.ScheduledTransaction?.[0].id,
        receivedDate: receivedTransaction.receivedDate,
        receivedTime: receivedTransaction.receivedTime,
        pttNo: receivedTransaction.pttNo,
        manifestNo: receivedTransaction.manifestNo,
        pullOutFormNo: receivedTransaction.pullOutFormNo,
        manifestWeight: receivedTransaction.manifestWeight,
        clientWeight: receivedTransaction.clientWeight,
        grossWeight: receivedTransaction.grossWeight,
        tareWeight: receivedTransaction.tareWeight,
        netWeight: receivedTransaction.netWeight,
        remarks: receivedTransaction.remarks,
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
      "Are you sure you want to delete this Received Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/receivedTransaction/${row.ScheduledTransaction[0].ReceivedTransaction?.[0].id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();

      setSuccessMessage("Received Transaction Deleted Successfully!");
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
      receivedDate,
      receivedTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      statusId,
      createdBy,
    } = formData;

    if (
      !receivedDate ||
      !receivedTime ||
      !pttNo ||
      !manifestNo ||
      !pullOutFormNo ||
      !manifestWeight ||
      !clientWeight ||
      !grossWeight ||
      !tareWeight ||
      !netWeight ||
      !statusId ||
      !createdBy
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        await axios.put(
          `${apiUrl}/api/receivedTransaction/${formData.id}`,
          formData
        );

        setSuccessMessage("Received Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/receivedTransaction`, formData);

        setSuccessMessage("Receive Transaction Submitted Successfully!");
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
        buttonText={"Receive"}
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
      />
    </Box>
  );
};

export default ReceivedTransactions;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import Header from "../../../../../OtherComponents/Header";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const DispatchedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    scheduledTransactionId: "",
    vehicleId: "",
    driverId: "",
    helperIds: "",
    isDispatched: false,
    dispatchedDate: "",
    dispatchedTime: "",
    remarks: "",
    statusId: 3,
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const dispatchedTransactionResponse = await axios.get(
        `${apiUrl}/api/dispatchedTransaction`
      );

      // Define the logisticsId to match
      const matchingLogisticsId = "0577d985-8f6f-47c7-be3c-20ca86021154";

      // For pending transactions
      const filteredPendingTransactions =
        dispatchedTransactionResponse.data.pendingTransactions.filter(
          (transaction) =>
            transaction.ScheduledTransaction &&
            transaction.ScheduledTransaction[0].logisticsId ===
              matchingLogisticsId
        );
      setPendingTransactions(filteredPendingTransactions);

      // For in-progress transactions
      const filteredInProgressTransactions =
        dispatchedTransactionResponse.data.inProgressTransactions.filter(
          (transaction) =>
            transaction.ScheduledTransaction &&
            transaction.ScheduledTransaction[0].logisticsId ===
              matchingLogisticsId
        );
      setInProgressTransactions(filteredInProgressTransactions);

      // For finished transactions
      const filteredFinishedTransactions =
        dispatchedTransactionResponse.data.finishedTransactions.filter(
          (transaction) =>
            transaction.ScheduledTransaction &&
            transaction.ScheduledTransaction[0].logisticsId ===
              matchingLogisticsId
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
      vehicleTypeId: row.QuotationTransportation.vehicleTypeId,
      id: "",
      bookedTransactionId: row.id,
      scheduledTransactionId: row.ScheduledTransaction[0].id,
      vehicleId: "",
      driverId: "",
      helperIds: "",
      isDispatched: false,
      dispatchedDate: "",
      dispatchedTime: "",
      remarks: "",
      statusId: 3,
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

  const handleAutocompleteChange = (event, newValue) => {
    const updatedHelperIds = newValue.map((item) => item.employeeId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      helperIds: updatedHelperIds.join(", "),
    }));
  };

  const handleEditClick = (row) => {
    const typeToEdit = inProgressTransactions.find(
      (type) => type.id === row.id
    );

    if (typeToEdit) {
      const dispatchedTransaction =
        typeToEdit.ScheduledTransaction?.[0].DispatchedTransaction?.[0] || {};

      setFormData({
        vehicleTypeId: typeToEdit.QuotationTransportation.vehicleTypeId,
        id: dispatchedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        scheduledTransactionId: typeToEdit.ScheduledTransaction?.[0]?.id,
        vehicleId: dispatchedTransaction.vehicleId,
        driverId: dispatchedTransaction.driverId,
        helperIds: dispatchedTransaction.helperId,
        isDispatched: dispatchedTransaction.isDispatched,
        dispatchedDate: dispatchedTransaction.dispatchedDate,
        dispatchedTime: dispatchedTransaction.dispatchedTime,
        remarks: dispatchedTransaction.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      });

      setOpenModal(true);
    } else {
      console.error(
        `Dispatched Transaction with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = async (row) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Dispatched Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/dispatchedTransaction/${row.ScheduledTransaction[0].DispatchedTransaction[0].id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();

      setSuccessMessage("Dispatched Transaction deleted successfully!");
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
      dispatchedDate,
      dispatchedTime,
      vehicleId,
      driverId,
      helperIds,
      statusId,
      createdBy,
    } = formData;

    if (
      !dispatchedDate ||
      !dispatchedTime ||
      !vehicleId ||
      !driverId ||
      helperIds.length === 0 ||
      !statusId ||
      !createdBy
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (!formData.driverId) {
        setError("Driver selection is required.");
      } else {
        setError("");

        if (formData.id) {
          await axios.put(
            `${apiUrl}/api/dispatchedTransaction/${formData.id}`,
            formData
          );

          setSuccessMessage("Update Dispatched Transaction successfully!");
        } else {
          await axios.post(`${apiUrl}/api/dispatchedTransaction`, formData);

          setSuccessMessage("Dispatch Transaction successfully!");
        }

        fetchData();

        setShowSuccessMessage(true);
        handleCloseModal();
        setLoading(false);
      }
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
        buttonText={"Dispatch"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <Modal
        user={user}
        error={error}
        handleAutocompleteChange={handleAutocompleteChange}
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

export default DispatchedTransactions;

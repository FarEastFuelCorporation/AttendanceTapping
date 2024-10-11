import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../../../OtherComponents/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const CollectedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  // Create refs for the input fields
  const collectedDateRef = useRef();
  const collectedTimeRef = useRef();
  const collectedAmountRef = useRef();
  const remarksRef = useRef();

  const initialFormData = {
    id: "",
    bookedTransactionId: "",
    billingApprovalTransactionId: "",
    collectedDate: "",
    collectedTime: "",
    collectedAmount: 0,
    remarks: "",
    statusId: 11,
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
      const collectionTransactionResponse = await axios.get(
        `${apiUrl}/api/collectionTransaction`
      );
      // For pending transactions
      setPendingTransactions(
        collectionTransactionResponse.data.pendingTransactions
      );

      // For in progress transactions
      setInProgressTransactions(
        collectionTransactionResponse.data.inProgressTransactions
      );

      // For finished transactions
      setFinishedTransactions(
        collectionTransactionResponse.data.finishedTransactions
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
      billingDistributionTransactionId:
        row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
          .CertifiedTransaction[0].BilledTransaction[0]
          .BillingApprovalTransaction.BillingDistributionTransaction.id,
      collectedDate: "",
      collectedTime: "",
      collectedAmount: 0,
      remarks: "",
      statusId: 11,
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
      const collectedTransaction =
        typeToEdit.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
          ?.SortedTransaction?.[0]?.CertifiedTransaction?.[0]
          .BilledTransaction[0].BillingApprovalTransaction
          .BillingDistributionTransaction.CollectedTransaction || {};

      setFormData({
        id: collectedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        billingApprovalTransactionId:
          collectedTransaction.billingDistributionTransactionId,
        collectedDate: collectedTransaction.collectedDate,
        collectedTime: collectedTransaction.collectedTime,
        collectedAmount: collectedTransaction.collectedAmount,
        remarks: collectedTransaction.remarks,
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
      "Are you sure you want to delete this Collected Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/collectionTransaction/${row.ScheduledTransaction?.[0].ReceivedTransaction?.[0].SortedTransaction?.[0].CertifiedTransaction?.[0].BilledTransaction?.[0]?.BillingApprovalTransaction.BillingDistributionTransaction.CollectedTransaction.id}`,
        {
          data: {
            deletedBy: user.id,
            bookedTransactionId: row.id,
          },
        }
      );

      fetchData();

      setSuccessMessage("Collected Transaction Deleted Successfully!");
      setShowSuccessMessage(true);

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateForm = (data) => {
    let validationErrors = [];

    // Validate collectedDate
    if (!data.collectedDate) {
      validationErrors.push("Collected Date is required.");
    }

    // Validate collectedTime
    if (!data.collectedTime) {
      validationErrors.push("Collected Time is required.");
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

    // Set formData from refs before validation
    const updatedFormData = {
      ...formData,
      collectedDate: collectedDateRef.current.value,
      collectedTime: collectedTimeRef.current.value,
      collectedAmount: collectedAmountRef.current.value,
      remarks: remarksRef.current.value,
    };

    // Perform client-side validation
    if (!validateForm(updatedFormData)) {
      return;
    }

    try {
      setLoading(true);

      if (updatedFormData.id) {
        await axios.put(
          `${apiUrl}/api/collectionTransaction/${updatedFormData.id}`,
          updatedFormData
        );

        setSuccessMessage("Collected Transaction Updated Successfully!");
      } else {
        await axios.post(
          `${apiUrl}/api/collectionTransaction`,
          updatedFormData
        );

        setSuccessMessage("Collected Transaction Submitted Successfully!");
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
        buttonText={"Collect"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        setSuccessMessage={setSuccessMessage}
        setShowSuccessMessage={setShowSuccessMessage}
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
        refs={{
          collectedDateRef,
          collectedTimeRef,
          collectedAmountRef,
          remarksRef,
        }}
      />
    </Box>
  );
};

export default CollectedTransactions;

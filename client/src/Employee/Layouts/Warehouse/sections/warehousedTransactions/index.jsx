import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Header from "../../../HR/sections/Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import Transaction from "../../../../../OtherComponents/Transaction";
import Modal from "../../../../../OtherComponents/Modal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const getInitialWarehousedItemValues = () => ({
  warehousedTransactionId: "",
  gatePass: "",
  warehouse: "",
  area: "",
  section: "",
  level: "",
  palletNumber: "",
  steamNumber: "",
  quantity: 0,
  unit: "",
  description: "",
});

// Helper function to filter by submitTo "SORTING"
const filterBySubmitToSorting = (transactions) => {
  return transactions.filter((transaction) => {
    const scheduledTransaction = transaction.ScheduledTransaction?.[0];
    const receivedTransaction = scheduledTransaction?.ReceivedTransaction?.[0];
    return receivedTransaction?.submitTo === "WAREHOUSE";
  });
};

const WarehousedTransactions = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const methods = useForm({
    defaultValues: {
      warehousedItems: [getInitialWarehousedItemValues()],
      warehousedDate: "",
      warehousedTime: "",
      remarks: "",
      statusId: 5,
      createdBy: user.id,
    },
  });

  const { reset, handleSubmit } = methods;

  const [openModal, setOpenModal] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [inProgressTransactions, setInProgressTransactions] = useState([]);
  const [finishedTransactions, setFinishedTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/api/warehousedTransaction`);

      setPendingTransactions(filterBySubmitToSorting(data.pendingTransactions));
      setInProgressTransactions(
        filterBySubmitToSorting(data.inProgressTransactions)
      );
      setFinishedTransactions(
        filterBySubmitToSorting(data.finishedTransactions)
      );

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
    const initialValues = {
      id: "",
      bookedTransactionId: row.id,
      receivedTransactionId:
        row.ScheduledTransaction[0].ReceivedTransaction[0].id,
      warehousedDate: "",
      warehousedTime: "",
      warehousedItems: [getInitialWarehousedItemValues()],
      remarks: "",
      statusId: 5,
      createdBy: user.id,
    };
    reset(initialValues); // Reset the form with initial values
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
  };

  const handleEditClick = (row) => {
    const typeToEdit = inProgressTransactions.find(
      (type) => type.id === row.id
    );

    if (typeToEdit) {
      const warehousedTransaction =
        typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0]
          .SortedTransaction?.[0] || {};
      const initialValues = {
        id: warehousedTransaction.id,
        bookedTransactionId: typeToEdit.id,
        receivedTransactionId:
          typeToEdit.ScheduledTransaction?.[0].ReceivedTransaction?.[0].id,
        warehousedDate: warehousedTransaction.warehousedDate,
        warehousedTime: warehousedTransaction.warehousedTime,
        warehousedItems: warehousedTransaction.WarehousedTransactionItem
          ? warehousedTransaction.WarehousedTransactionItem.map((item) => ({
              warehousedTransactionId: item.warehousedTransactionId || "",
              gatePass: item.gatePass || "",
              warehouse: item.warehouse || "",
              area: item.area || "",
              section: item.section || "",
              level: item.level || "",
              palletNumber: item.palletNumber || "",
              steamNumber: item.steamNumber || "",
              quantity: item.quantity || 0,
              unit: item.unit || "",
              description: item.description || "",
            }))
          : [getInitialWarehousedItemValues()],
        remarks: warehousedTransaction.remarks,
        statusId: typeToEdit.statusId,
        createdBy: user.id,
      };

      reset(initialValues); // Reset form data with fetched values
      setOpenModal(true);
    } else {
      console.error(
        `Received Transaction with ID ${row.id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = async (row) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Warehoused Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(
        `${apiUrl}/api/warehousedTransaction/${row.ScheduledTransaction[0].ReceivedTransaction?.[0].SortedTransaction?.[0].id}`,
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

  const onSubmit = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      if (data.id) {
        await axios.put(`${apiUrl}/api/warehousedTransaction/${data.id}`, data);

        setSuccessMessage("Warehoused Transaction Updated Successfully!");
      } else {
        await axios.post(`${apiUrl}/api/warehousedTransaction`, data);

        setSuccessMessage("Warehoused Transaction Submitted Successfully!");
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
        buttonText={"Warehouse"}
        pendingTransactions={pendingTransactions}
        inProgressTransactions={inProgressTransactions}
        finishedTransactions={finishedTransactions}
        handleOpenModal={handleOpenModal}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal
            user={user}
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmit(onSubmit)}
          />
        </form>
      </FormProvider>
    </Box>
  );
};

export default WarehousedTransactions;

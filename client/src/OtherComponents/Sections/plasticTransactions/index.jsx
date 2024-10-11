import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Modal, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../Header";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PageviewIcon from "@mui/icons-material/Pageview";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../../../theme";
import SuccessMessage from "../../SuccessMessage";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import LoadingSpinner from "../../LoadingSpinner";
import Counter from "../../Counter";
import PlasticTransactionModal from "../../TransactionModals/PlasticTransactionModal";
import { formatDateFull, formatWeightWithNA } from "../../Functions";
import PlasticCreditsForm from "../../Certificates/PlasticCredits/PlasticCreditsForm";

const PlasticTransactions = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    clientId: "",
    certificateNumber: "",
    issuedDate: "",
    issuedTime: "",
    typeOfCertificate: "",
    volume: 0,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [plasticTransactions, setPlasticTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [data, setdata] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/plasticTransaction`);

      // Map through the transactions to include Client.clientName in each one
      const updatedTransactions = response.data.plasticTransactions.map(
        (transaction) => {
          return {
            ...transaction,
            clientName: transaction.Client?.clientName || "N/A", // Add clientName, handle if Client is null or undefined
          };
        }
      );

      setPlasticTransactions(updatedTransactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessMessage]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    clearFormData();
  };

  const handleOpenCertificateModal = () => {
    setOpenCertificateModal(true);
  };
  const handleCloseCertificateModal = () => {
    setOpenCertificateModal(false);
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleViewClick = (params) => {
    try {
      setShowForm(true); // Set state to show the form
      setdata(params); // Set state to show the form
      handleOpenCertificateModal();
    } catch (error) {
      console.error("Error fetching document file:", error);
    }
  };

  const handleEditClick = (id) => {
    const typeToEdit = plasticTransactions.find((type) => type.id === id);
    if (typeToEdit) {
      setFormData({
        id: plasticTransactions.id,
        clientId: plasticTransactions.clientId,
        certificateNumber: plasticTransactions.certificateNumber,
        issuedDate: plasticTransactions.issuedDate,
        issuedTime: plasticTransactions.issuedTime,
        typeOfCertificate: plasticTransactions.typeOfCertificate,
        volume: plasticTransactions.volume,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Plastic Transaction with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Plastic Transaction?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/plasticTransaction/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Plastic Transaction Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateForm = () => {
    const errors = []; // Array to collect validation errors
    const { issuedDate, issuedTime, clientId, typeOfCertificate, volume } =
      formData;

    // Check if the issued date is a valid date
    if (!issuedDate) {
      errors.push("Issued Date is required.");
    } else {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
      if (!datePattern.test(issuedDate)) {
        errors.push("Issued Date must be in YYYY-MM-DD format.");
      }
    }

    // Check if the issued time is a valid time
    if (!issuedTime) {
      errors.push("Issued Time is required.");
    } else {
      const timePattern = /^(0?[0-1]\d|2[0-3]):([0-5]\d)$/; // HH:MM format
      if (!timePattern.test(issuedTime)) {
        errors.push("Issued Time must be in HH:MM format.");
      }
    }

    // Check if clientId is selected
    if (!clientId) {
      errors.push("Client must be selected.");
    }

    // Check if typeOfCertificate is valid
    const validCertificateTypes = ["PLASTIC CREDIT", "PLASTIC WASTE DIVERSION"];
    if (!validCertificateTypes.includes(typeOfCertificate)) {
      errors.push("Invalid Type of Certificate.");
    }

    // Check if volume is a positive number
    if (!volume) {
      errors.push("Volume is required.");
    } else if (isNaN(volume) || volume <= 0) {
      errors.push("Volume must be a positive number.");
    }

    return errors; // Return the array of errors
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(" ")); // Join errors into a single string
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing Plastic Transaction
        await axios.put(
          `${apiUrl}/api/plasticTransaction/${formData.id}`,
          formData
        );

        setSuccessMessage("Plastic Transaction Updated Successfully!");
      } else {
        // Add new Plastic Transaction
        await axios.post(`${apiUrl}/api/plasticTransaction`, formData);

        setSuccessMessage("Plastic Transaction Added Successfully!");
      }

      fetchData();
      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "certificateNumber",
      headerName: "Certificate Number",
      headerAlign: "center",
      align: "center",
      width: 140,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "volume",
      headerName: "Volume",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => (
        <div className={"wrap-text"} style={{ textAlign: "center" }}>
          {formatWeightWithNA(params.value)}
        </div>
      ),
    },
    {
      field: "typeOfCertificate",
      headerName: "Type of Certificate",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "issuedDate",
      headerName: "Issued Date",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => {
        const formattedDate = formatDateFull(params.value);
        return (
          <div>
            {renderCellWithWrapText({ ...params, value: formattedDate })}
          </div>
        );
      },
    },
    {
      field: "issuedTime",
      headerName: "Issued Time",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "view",
      headerName: "View File",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: colors.greenAccent[400], fontSize: "large" }}
          onClick={() => handleViewClick(params.row)}
        >
          <PageviewIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton
          color="warning"
          onClick={() => handleEditClick(params.row.id)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteClick(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Plastic Transactions"
          subtitle="List of Plastic Transactions"
        />
        <Box sx={{ display: "flex" }}>
          <Counter label={"Generated Plastic Credits"} content={600000} />
          <Counter label={"Issued Plastic Credits"} content={100000} />
          <Counter label={"Available Plastic Credits"} content={500000} />
        </Box>
        <Box display="flex">
          <IconButton onClick={handleOpenModal}>
            <PostAddIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>

      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}

      {/* <PlasticCreditsForm /> */}

      <CustomDataGridStyles>
        <DataGrid
          rows={plasticTransactions ? plasticTransactions : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "typeOfScrap", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <PlasticTransactionModal
        open={openModal}
        onClose={handleCloseModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
      {showForm && (
        <Modal
          open={openCertificateModal}
          onClose={handleCloseCertificateModal}
          sx={{
            display: "flex",
            justifyContent: "center",
            border: "none",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <PlasticCreditsForm row={data} />
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default PlasticTransactions;

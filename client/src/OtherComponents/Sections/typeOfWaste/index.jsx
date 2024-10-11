import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../Header";
import { tokens } from "../../../theme";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";
import LoadingSpinner from "../../LoadingSpinner";

const TypeOfWastes = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    wasteCategory: "",
    wasteCode: "",
    wasteDescription: "",
    treatmentProcessId: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [typeOfWastes, setTypeOfWastes] = useState([]);
  const [treatmentProcess, setTreatmentProcess] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/typeOfWaste`);

      const flattenedData = response.data.typeOfWastes.map((item) => ({
        ...item,
        treatmentProcess: item.TreatmentProcess
          ? item.TreatmentProcess.treatmentProcess
          : null,
      }));

      setTypeOfWastes(flattenedData);

      const treatmentProcessResponse = await axios.get(
        `${apiUrl}/api/treatmentProcess`
      );

      setTreatmentProcess(treatmentProcessResponse.data.treatmentProcesses);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching typeOfWastes:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
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

  const handleEditClick = (id) => {
    const wasteToEdit = typeOfWastes.find((waste) => waste.id === id);
    if (wasteToEdit) {
      setFormData({
        id: wasteToEdit.id,
        wasteCategory: wasteToEdit.wasteCategory,
        wasteCode: wasteToEdit.wasteCode,
        wasteDescription: wasteToEdit.wasteDescription,
        treatmentProcessId: wasteToEdit.treatmentProcessId || "",
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Type of Waste with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Type Of Waste?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/typeOfWaste/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Type Of Waste Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const { wasteCategory, wasteCode, wasteDescription, treatmentProcessId } =
      formData;

    // Check if all required fields are filled
    if (
      !wasteCategory ||
      !wasteCode ||
      !wasteDescription ||
      !treatmentProcessId
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing type of waste
        await axios.put(`${apiUrl}/api/typeOfWaste/${formData.id}`, formData);

        setSuccessMessage("Type Of Waste Updated Successfully!");
      } else {
        // Add new type of waste
        await axios.post(`${apiUrl}/api/typeOfWaste`, formData);

        setSuccessMessage("Type Of Waste Added Successfully!");
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
      field: "wasteCategory",
      headerName: "Waste Category",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "wasteCode",
      headerName: "Waste Code",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "wasteDescription",
      headerName: "Waste Description",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "treatmentProcess",
      headerName: "Treatment Process",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
  ];

  if (user.userType === 7) {
    columns.push(
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
      }
    );
  }

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Waste Types" subtitle="List of Waste Types" />
        {user.userType === 7 && (
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
      <CustomDataGridStyles>
        <DataGrid
          rows={typeOfWastes}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "wasteCode", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id
              ? "Update Type of Waste Form"
              : "Add New Type of Waste Form"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <TextField
            label="Waste Category"
            name="wasteCategory"
            value={formData.wasteCategory}
            onChange={handleInputChange}
            select
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          >
            <MenuItem key={"HW"} value={"HW"}>
              {"HAZARDOUS WASTE"}
            </MenuItem>
            <MenuItem key={"NHW"} value={"NHW"}>
              {"NON HAZARDOUS WASTE"}
            </MenuItem>
          </TextField>
          <TextField
            label="Waste Code"
            name="wasteCode"
            value={formData.wasteCode}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
          />
          <TextField
            label="Waste Description"
            name="wasteDescription"
            value={formData.wasteDescription}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
          />
          <TextField
            label="Treatment Process"
            name="treatmentProcessId"
            value={formData.treatmentProcessId}
            onChange={handleInputChange}
            select
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          >
            {treatmentProcess.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.treatmentProcess}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Created By"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleInputChange}
            fullWidth
            autoComplete="off"
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update Type of Waste" : "Add Type of Waste"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TypeOfWastes;

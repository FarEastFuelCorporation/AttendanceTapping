import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Button,
  useTheme,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { format } from "date-fns";
import Header from "../../Header";
import { tokens } from "../../../theme";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";
import LoadingSpinner from "../../LoadingSpinner";

const VehicleMaintenanceRequest = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    plateNumber: "",
    requestDetails: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [vehicleRequests, setVehicleRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/vehicleMaintenanceRequest`
      );

      const flattenedData = response.data.vehicleMaintenanceRequests.map(
        (item) => ({
          ...item,
          createdByName: item.Employee
            ? item.Employee.firstName + " " + item.Employee.lastName
            : null,
        })
      );

      setVehicleRequests(flattenedData);

      const vehicleResponse = await axios.get(`${apiUrl}/api/vehicle`);
      const sortedVehicles = vehicleResponse.data.vehicles.sort((a, b) => {
        if (a.plateNumber < b.plateNumber) {
          return -1;
        }
        if (a.plateNumber > b.plateNumber) {
          return 1;
        }
        return 0;
      });
      setVehicles(sortedVehicles);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessMessage]);

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
    const requestToEdit = vehicleRequests.find((request) => request.id === id);
    if (requestToEdit) {
      setFormData({
        id: requestToEdit.id,
        plateNumber: requestToEdit.plateNumber,
        requestDetails: requestToEdit.requestDetails,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(
        `Vehicle maintenance request with ID ${id} not found for editing.`
      );
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Vehicle Maintenance Request?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/vehicleMaintenanceRequest/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Vehicle Maintenance Request Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const { plateNumber, requestDetails } = formData;

    // Check if all required fields are filled
    if (!plateNumber || !requestDetails) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing vehicle maintenance request
        await axios.put(
          `${apiUrl}/api/vehicleMaintenanceRequest/${formData.id}`,
          formData
        );

        setSuccessMessage("Vehicle Maintenance Request Updated Successfully!");
      } else {
        // Add new vehicle maintenance request
        await axios.post(`${apiUrl}/api/vehicleMaintenanceRequest`, formData);

        setSuccessMessage("Vehicle Maintenance Request Added Successfully!");
      }

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
      field: "plateNumber",
      headerName: "Plate Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "requestDetails",
      headerName: "Request Details",
      headerAlign: "center",
      align: "center",
      flex: 2,
      minWidth: 250,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdByName",
      headerName: "Requested By",
      headerAlign: "center",
      align: "center",
      minWidth: 250,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdAt",
      headerName: "Date Of Request",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      valueFormatter: (params) => {
        if (!params.value) return ""; // Handle empty or null values
        return format(new Date(params.value), "MMMM dd yyyy");
      },
      renderCell: renderCellWithWrapText,
    },
  ];

  if (user.userType === 3) {
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
        <Header
          title="Vehicle Maintenance Requests"
          subtitle="List of Vehicle Maintenance Requests"
        />
        {user.userType === 3 && (
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
          rows={vehicleRequests}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "plateNumber", sort: "asc" }],
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
              ? "Update Vehicle Maintenance Request"
              : "Add New Vehicle Maintenance Request"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <TextField
            label="Plate Number"
            name="plateNumber"
            value={formData.plateNumber}
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
            {vehicles.map((type) => (
              <MenuItem key={type.id} value={type.plateNumber}>
                {type.plateNumber}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Request Details"
            name="requestDetails"
            value={formData.requestDetails}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
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
            {formData.id
              ? "Update Vehicle Maintenance Request"
              : "Add Vehicle Maintenance Request"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default VehicleMaintenanceRequest;

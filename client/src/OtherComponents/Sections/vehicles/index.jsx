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
import Header from "../../Header";
import { tokens } from "../../../theme";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";
import LoadingSpinner from "../../LoadingSpinner";

const Vehicles = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    vehicleTypeId: "",
    plateNumber: "",
    vehicleName: "",
    netCapacity: "",
    ownership: "",
    vehicleId: "",
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/vehicle`);
      const vehicleRecords = response.data;

      const flattenedData = vehicleRecords.vehicles.map((vehicle) => ({
        ...vehicle,
        typeOfVehicle: vehicle.VehicleType
          ? vehicle.VehicleType.typeOfVehicle
          : null,
      }));

      // Set state with vehicles including typeOfVehicle
      setVehicleData(flattenedData);

      const vehicleTypeResponse = await axios.get(`${apiUrl}/api/vehicleType`);
      const sortedVehicleTypes = vehicleTypeResponse.data.vehicleTypes.sort(
        (a, b) => {
          if (a.typeOfVehicle < b.typeOfVehicle) {
            return -1;
          }
          if (a.typeOfVehicle > b.typeOfVehicle) {
            return 1;
          }
          return 0;
        }
      );
      setVehicleTypes(sortedVehicleTypes);

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
  }, []);

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
    const vehicleToEdit = vehicleData.find((vehicle) => vehicle.id === id);
    if (vehicleToEdit) {
      setFormData({
        id: vehicleToEdit.id,
        vehicleTypeId: vehicleToEdit.vehicleTypeId,
        plateNumber: vehicleToEdit.plateNumber,
        vehicleName: vehicleToEdit.vehicleName,
        netCapacity: vehicleToEdit.netCapacity,
        ownership: vehicleToEdit.ownership,
        createdBy: user.id,
      });
      handleOpenModal();
    } else {
      console.error(`Vehicle with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Vehicle?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/vehicle/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Vehicle Deleted Successfully!");
      setShowSuccessMessage(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const { vehicleTypeId, plateNumber, vehicleName, netCapacity, ownership } =
      formData;

    // Check if all required fields are filled
    if (
      !vehicleTypeId ||
      !plateNumber ||
      !vehicleName ||
      !netCapacity ||
      !ownership
    ) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing vehicle
        await axios.put(`${apiUrl}/api/vehicle/${formData.id}`, formData);

        setSuccessMessage("Vehicle Updated Successfully!");
      } else {
        // Add new vehicle
        await axios.post(`${apiUrl}/api/vehicle`, formData);

        setSuccessMessage("Vehicle Added Successfully!");
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
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "vehicleName",
      headerName: "Vehicle Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "netCapacity",
      headerName: "Net Capacity",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "ownership",
      headerName: "Ownership",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "typeOfVehicle",
      headerName: "Vehicle Type",
      headerAlign: "center",
      align: "center",
      width: 200,
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
        <Header title="Vehicles" subtitle="List of Vehicles" />
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
      <CustomDataGridStyles>
        <DataGrid
          rows={vehicleData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "typeOfVehicle", sort: "asc" }],
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
            {formData.id ? "Update Vehicle" : "Add New Vehicle"}
          </Typography>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <TextField
            label="Vehicle Type"
            name="vehicleTypeId"
            value={formData.vehicleTypeId}
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
            {vehicleTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.typeOfVehicle}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Plate Number"
            name="plateNumber"
            value={formData.plateNumber}
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
            label="Vehicle Name"
            name="vehicleName"
            value={formData.vehicleName}
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
            label="Net Capacity"
            name="netCapacity"
            value={formData.netCapacity}
            onChange={handleInputChange}
            type="number"
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
            label="Ownership"
            name="ownership"
            value={formData.ownership}
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
            <MenuItem value="OWNED">OWNED</MenuItem>
            <MenuItem value="LEASED">LEASED</MenuItem>
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
            {formData.id ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Vehicles;

import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";

const DispatchModal = ({
  error,
  handleAutocompleteChange,
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [employeesData, setEmployeesData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeResponse, vehicleResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/employee`),
          axios.get(`${apiUrl}/api/vehicle/${formData.vehicleTypeId}`),
        ]);

        setEmployeesData(employeeResponse.data.employees);
        setVehiclesData(vehicleResponse.data.vehicles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, formData.vehicleTypeId]);

  return (
    <Modal open={open} onClose={onClose}>
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
            ? "Update Dispatched Transaction"
            : "Dispatch Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <TextField
            label="Dispatch Date"
            name="dispatchedDate"
            value={formData.dispatchedDate}
            onChange={handleInputChange}
            fullWidth
            type="date"
            required
            InputLabelProps={{
              shrink: true,
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
          <TextField
            label="Dispatch Time"
            name="dispatchedTime"
            value={formData.dispatchedTime}
            onChange={handleInputChange}
            fullWidth
            type="time"
            required
            InputLabelProps={{
              shrink: true,
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
        </div>
        <Autocomplete
          options={vehiclesData}
          getOptionLabel={(option) =>
            option.id === "" ? "" : `${option.plateNumber}`
          }
          value={
            vehiclesData.find((emp) => emp.id === formData.vehicleId) || null
          }
          onChange={(event, newValue) => {
            handleInputChange({
              target: {
                name: "vehicleId",
                value: newValue ? newValue.id : "",
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose Vehicle"
              name="vehicleId"
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              error={!!error}
              helperText={error}
            />
          )}
        />{" "}
        <Autocomplete
          options={employeesData}
          getOptionLabel={(option) =>
            option.employeeId === ""
              ? ""
              : `${option.firstName} ${option.lastName}`
          }
          value={
            employeesData.find((emp) => emp.employeeId === formData.driverId) ||
            null
          }
          onChange={(event, newValue) => {
            handleInputChange({
              target: {
                name: "driverId",
                value: newValue ? newValue.employeeId : "",
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose Driver"
              name="driverId"
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              error={!!error}
              helperText={error}
            />
          )}
        />{" "}
        <Autocomplete
          multiple
          options={employeesData}
          getOptionLabel={(option) =>
            option.employeeId === ""
              ? ""
              : `${option.firstName} ${option.lastName}`
          }
          value={employeesData.filter((emp) =>
            formData.helperIds.includes(emp.employeeId)
          )}
          onChange={handleAutocompleteChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose Helper(s)"
              name="helperIds"
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          )}
        />
        <TextField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{
            style: {
              color: colors.grey[100],
            },
          }}
          autoComplete="off"
        />
        <TextField
          label="Status Id"
          name="statusId"
          value={formData.statusId}
          onChange={handleInputChange}
          fullWidth
          autoComplete="off"
          style={{ display: "none" }}
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
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {formData.id ? "Update" : "Dispatch"}
        </Button>
      </Box>
    </Modal>
  );
};

export default DispatchModal;

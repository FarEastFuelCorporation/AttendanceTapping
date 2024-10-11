import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";

const PlasticTransactionModal = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const [clients, setClients] = useState([]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const clientResponse = await axios.get(`${apiUrl}/api/client`);

      setClients(clientResponse.data.clients);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  // Fetch data when component mounts or apiUrl/processDataTransaction changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          {formData.id ? "Update Plastic Transaction" : "Plastic Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <TextField
            label="Issued Date"
            name="issuedDate"
            value={formData.issuedDate}
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
            label="Issued Time"
            name="issuedTime"
            value={formData.issuedTime}
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
          options={clients || []}
          getOptionLabel={(option) => option.clientName} // Display name of the option
          onChange={(event, newValue) => {
            // Handle the change and update your form data
            handleInputChange({
              target: {
                name: "clientId",
                value: newValue ? newValue.clientId : "",
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Clients"
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              // Add other props if necessary
            />
          )}
          isOptionEqualToValue={(option, value) =>
            option.clientId === value.clientId
          } // Optional: for better performance
          noOptionsText="No Client available" // Message when no options are found
        />
        <TextField
          label="Type of Certificate"
          name="typeOfCertificate"
          value={formData.typeOfCertificate || ""}
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
          <MenuItem key={1} value={"PLASTIC CREDIT"}>
            PLASTIC CREDIT
          </MenuItem>
          <MenuItem key={2} value={"PLASTIC WASTE DIVERSION"}>
            PLASTIC WASTE DIVERSION
          </MenuItem>
        </TextField>
        <TextField
          label="Volume"
          name="volume"
          value={formData.volume}
          onChange={handleInputChange}
          fullWidth
          type="number"
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
          {formData.id ? "Update" : "Submit"}
        </Button>
      </Box>
    </Modal>
  );
};

export default PlasticTransactionModal;

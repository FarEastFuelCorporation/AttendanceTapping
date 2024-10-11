import React from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { tokens } from "../../theme";

const ReceiveModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const calculateNetWeight = (grossWeight, tareWeight) => {
    return grossWeight - tareWeight;
  };

  const handleInputChangeWithNetWeight = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "grossWeight" || name === "tareWeight") {
      const netWeight = calculateNetWeight(
        parseFloat(updatedFormData.grossWeight || 0),
        parseFloat(updatedFormData.tareWeight || 0)
      );
      updatedFormData.netWeight = netWeight;
    }

    setFormData(updatedFormData);
  };

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
          {formData.id ? "Update Received Transaction" : "Receive Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <TextField
            label="Receive Date"
            name="receivedDate"
            value={formData.receivedDate}
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
            label="Receive Time"
            name="receivedTime"
            value={formData.receivedTime}
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
        <TextField
          label="PTT No."
          name="pttNo"
          value={formData.pttNo}
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
          label="Manifest No."
          name="manifestNo"
          value={formData.manifestNo}
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
          label="Pull Out Form No."
          name="pullOutFormNo"
          value={formData.pullOutFormNo}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{
            style: {
              color: colors.grey[100],
            },
          }}
          autoComplete="off"
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Manifest Weight"
              name={`manifestWeight`}
              value={formData.manifestWeight}
              onChange={handleInputChange}
              type="number"
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Client Weight"
              name={`clientWeight`}
              value={formData.clientWeight}
              onChange={handleInputChange}
              type="number"
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Gross Weight"
              name={`grossWeight`}
              value={formData.grossWeight}
              onChange={handleInputChangeWithNetWeight}
              type="number"
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Tare Weight"
              name={`tareWeight`}
              value={formData.tareWeight}
              onChange={handleInputChangeWithNetWeight}
              type="number"
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Net Weight"
              name={`netWeight`}
              value={formData.netWeight}
              onChange={handleInputChange}
              type="number"
              fullWidth
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              disabled
            />
          </Grid>
        </Grid>
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
          {formData.id ? "Update" : "Receive"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ReceiveModal;

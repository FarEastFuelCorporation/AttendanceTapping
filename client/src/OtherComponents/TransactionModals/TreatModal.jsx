import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const TreatModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleFormSubmit,
  errorMessage,
  setErrorMessage,
  showErrorMessage,
  setShowErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [treatmentProcesses, setTreatmentProcesses] = useState([]);
  const [treatmentMachines, setTreatmentMachines] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalTreatedWeight, setTotalTreatedWeight] = useState(0);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const [treatmentProcessesResponse, treatmentMachinesResponse] =
            await Promise.all([
              axios.get(`${apiUrl}/api/treatmentProcess`),
              axios.get(`${apiUrl}/api/treatmentMachine`),
            ]);

          setTreatmentProcesses(
            treatmentProcessesResponse.data.treatmentProcesses
          );
          setTreatmentMachines(
            treatmentMachinesResponse.data.treatmentMachines
          );
          setTotalWeight(formData.waste.weight);
          setTotalTreatedWeight(
            formData.waste.treatedWeight +
              calculateTotalWeight(formData.treatedWastes)
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
    if (!open) {
      setErrorMessage("");
      setShowErrorMessage(false);
    }
  }, [
    open,
    formData.clientId,
    formData.waste.weight,
    formData.treatedWastes,
    setErrorMessage,
    setShowErrorMessage,
    formData.waste.treatedWeight,
  ]);

  const formatWeight = (weight) => {
    // Check if weight is NaN
    if (isNaN(weight)) {
      return ""; // Return empty string if weight is NaN
    }

    // Format the number if it's a valid number
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(weight);
  };

  // Function to calculate the total weight
  const calculateTotalWeight = (treatedWastes) => {
    return treatedWastes.reduce(
      (total, waste) => total + parseFloat(waste.weight || 0),
      0
    );
  };

  const handleInputChange = (e, index, name) => {
    const { value } = e.target;
    const updatedTreatedWastes = [...formData.treatedWastes];
    updatedTreatedWastes[index] = {
      ...updatedTreatedWastes[index],
      [name]: value,
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      treatedWastes: updatedTreatedWastes,
    }));
  };

  const handleTreatmentProcessChange = (index, value) => {
    // Filter the treatment machines based on the selected treatment process
    const filteredMachines = treatmentMachines.filter(
      (machine) => machine.TreatmentProcess.id === value
    );
    setFormData((prevFormData) => {
      const updatedTreatedWastes = [...prevFormData.treatedWastes];
      updatedTreatedWastes[index].treatmentProcessId = value;
      updatedTreatedWastes[index].filteredMachines = filteredMachines; // Store the filtered machines in formData for later use

      return {
        ...prevFormData,
        treatedWastes: updatedTreatedWastes,
      };
    });
  };

  const handleTreatmentMachineChange = (index, value) => {
    setFormData((prevFormData) => {
      const updatedTreatedWastes = [...prevFormData.treatedWastes];
      updatedTreatedWastes[index].treatmentMachineId = value;
      return {
        ...prevFormData,
        treatedWastes: updatedTreatedWastes,
      };
    });
  };

  const handleWeightChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedTreatedWastes = [...prevFormData.treatedWastes];
      const currentWeight = parseFloat(updatedTreatedWastes[index][field] || 0);
      const newValue = parseFloat(value);

      // Update the weight of the specified waste
      updatedTreatedWastes[index][field] = value;

      // Calculate the total weight including the current and new value
      const newTotalWeight = totalTreatedWeight - currentWeight + newValue;

      // Update the total treated weight state
      setTotalTreatedWeight(newTotalWeight);

      return {
        ...prevFormData,
        treatedWastes: updatedTreatedWastes,
      };
    });
  };

  const addWasteField = () => {
    const newWasteField = {
      treatedDate: null,
      treatedTime: null,
      treatmentProcessId: "",
      treatmentMachineId: "",
      weight: 0,
    };

    const newTreatedWastes = [...formData.treatedWastes, newWasteField];

    setFormData({
      ...formData,
      treatedWastes: newTreatedWastes,
    });

    // Recalculate the total weight
    setTotalTreatedWeight(calculateTotalWeight(newTreatedWastes));
  };

  const removeWasteField = (index) => {
    const newTreatedWastes = formData.treatedWastes.filter(
      (_, i) => i !== index
    );

    setFormData({
      ...formData,
      treatedWastes: newTreatedWastes,
    });

    // Recalculate the total weight
    setTotalTreatedWeight(calculateTotalWeight(newTreatedWastes));
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
          width: 1000,
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Treated Transaction" : "Treatment Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <Typography variant="h5">
            {formData.waste ? formData.waste.wasteName : ""}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                padding: "5px",
                borderRadius: "5px",
                backgroundColor:
                  totalTreatedWeight === totalWeight
                    ? colors.greenAccent[700]
                    : "red",
                color: "white",
              }}
            >
              <Typography variant="h6">
                {formatWeight(totalTreatedWeight)} Kg Treated /
                {formatWeight(totalWeight)} Kg
              </Typography>
            </Box>
          </Box>
        </Box>
        {formData.treatedWastes.map((waste, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Waste Entry #{index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id={`treatmentProcess-type-select-label-${index}`}
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Treatment Process
                  </InputLabel>
                  <Select
                    labelId={`treatmentProcess-type-select-label-${index}`}
                    name={`treatedWastes[${index}].treatmentProcessId`}
                    value={waste.treatmentProcessId}
                    onChange={(e) =>
                      handleTreatmentProcessChange(index, e.target.value)
                    }
                    label="treatmentProcess"
                    fullWidth
                    required
                  >
                    {treatmentProcesses.map((process) => (
                      <MenuItem key={process.id} value={process.id}>
                        {process.treatmentProcess}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel
                    id={`treatmentMachine-type-select-label-${index}`}
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Treatment Machine
                  </InputLabel>
                  <Select
                    labelId={`treatmentMachine-type-select-label-${index}`}
                    name={`treatedWastes[${index}].treatmentMachineId`}
                    value={waste.treatmentMachineId}
                    onChange={(e) =>
                      handleTreatmentMachineChange(index, e.target.value)
                    }
                    label="treatmentMachine"
                    fullWidth
                    required
                  >
                    {waste.filteredMachines &&
                      waste.filteredMachines.map((machine) => (
                        <MenuItem key={machine.id} value={machine.id}>
                          {machine.machineName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  label="Weight"
                  name={`treatedWastes[${index}].weight`}
                  value={waste.weight}
                  onChange={(e) =>
                    handleWeightChange(index, "weight", e.target.value)
                  }
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
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Treated Date"
                  name={`treatedWastes[${index}].treatedDate`}
                  value={waste.treatedDate}
                  onChange={(e) => handleInputChange(e, index, "treatedDate")}
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
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  label="Treated Time"
                  name={`treatedWastes[${index}].treatedTime`}
                  value={waste.treatedTime}
                  onChange={(e) => handleInputChange(e, index, "treatedTime")}
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
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  color="error"
                  onClick={() => removeWasteField(index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton color="success" onClick={addWasteField}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
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
          {formData.id ? "Update" : "Treat"}
        </Button>
      </Box>
    </Modal>
  );
};

export default TreatModal;

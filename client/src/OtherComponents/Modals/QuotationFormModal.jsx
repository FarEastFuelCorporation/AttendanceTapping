import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { tokens } from "../../theme";

const QuotationFormModal = ({
  user,
  open,
  handleCloseModal,
  formData,
  handleInputChange,
  handleFormSubmit,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [clients, setClients] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const modeOptions = ["BUYING", "CHARGE", "FREE OF CHARGE"];
  const unitOptions = ["PC", "KG", "L", "DRUM", "LOT", "TRIP"];
  const vatCalculationOptions = [
    "VAT EXCLUSIVE",
    "VAT INCLUSIVE",
    "NON VATABLE",
  ];

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const [clientsResponse, wasteTypesResponse, vehicleTypesResponse] =
            await Promise.all([
              axios.get(`${apiUrl}/api/client`),
              axios.get(`${apiUrl}/api/typeOfWaste`),
              axios.get(`${apiUrl}/api/vehicleType`),
            ]);

          setClients(clientsResponse.data.clients);
          setWasteTypes(wasteTypesResponse.data.typeOfWastes);
          setVehicleTypes(vehicleTypesResponse.data.vehicleTypes);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [open]);

  const handleAddWaste = () => {
    const newWaste = {
      id: null,
      quotationId: null,
      wasteId: "",
      wasteName: "",
      mode: "",
      unit: "",
      unitPrice: 0,
      vatCalculation: "",
      hasFixedRate: false,
      fixedWeight: 0,
      fixedPrice: 0,
    };
    const updatedWastes = [...formData.quotationWastes, newWaste];
    handleInputChange({
      target: { name: "quotationWastes", value: updatedWastes },
    });
  };

  const handleAddTransportation = () => {
    const newTransportation = {
      id: null,
      quotationId: null,
      vehicleTypeId: "",
      haulingArea: "",
      mode: "",
      unit: "",
      unitPrice: 0,
      vatCalculation: "",
      hasFixedRate: false,
      fixedWeight: 0,
      fixedPrice: 0,
    };
    const updatedTransportation = [
      ...formData.quotationTransportation,
      newTransportation,
    ];
    handleInputChange({
      target: { name: "quotationTransportation", value: updatedTransportation },
    });
  };

  const handleRemoveWaste = (index) => {
    const updatedWastes = formData.quotationWastes.filter(
      (waste, i) => i !== index
    );
    handleInputChange({
      target: { name: "quotationWastes", value: updatedWastes },
    });
  };

  const handleRemoveTransportation = (index) => {
    const updatedTransportation = formData.quotationTransportation.filter(
      (transportation, i) => i !== index
    );
    handleInputChange({
      target: { name: "quotationTransportation", value: updatedTransportation },
    });
  };

  const handleWasteInputChangeLocal = (index, field, value) => {
    const updatedWastes = formData.quotationWastes.map((waste, i) =>
      i === index ? { ...waste, [field]: value } : waste
    );
    handleInputChange({
      target: { name: "quotationWastes", value: updatedWastes },
    });
  };

  const handleTransportationInputChangeLocal = (index, field, value) => {
    const updatedTransportation = formData.quotationTransportation.map(
      (transportation, i) =>
        i === index ? { ...transportation, [field]: value } : transportation
    );
    handleInputChange({
      target: { name: "quotationTransportation", value: updatedTransportation },
    });
  };

  const handleWasteCodeChange = (index, value) => {
    const selectedWasteType = wasteTypes.find(
      (wasteType) => wasteType.id === value
    );

    if (selectedWasteType) {
      const updatedWastes = formData.quotationWastes.map((waste, i) =>
        i === index
          ? {
              ...waste,
              wasteId: value,
              wasteName: selectedWasteType.wasteDescription,
            }
          : waste
      );
      handleInputChange({
        target: { name: "quotationWastes", value: updatedWastes },
      });
    } else {
      console.warn(`No waste type found for id: ${value}`);
    }
  };

  const handleVehicleTypeChange = (index, value) => {
    const selectedVehicleType = vehicleTypes.find(
      (vehicleType) => vehicleType.id === value
    );

    if (selectedVehicleType) {
      const updatedTransportation = formData.quotationTransportation.map(
        (transportation, i) =>
          i === index
            ? {
                ...transportation,
                vehicleTypeId: value,
              }
            : transportation
      );
      handleInputChange({
        target: {
          name: "quotationTransportation",
          value: updatedTransportation,
        },
      });
    } else {
      console.warn(`No waste type found for id: ${value}`);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      style={{ overflowY: "scroll", scrollbarWidth: "none" }}
    >
      <Box
        p={3}
        bgcolor="background.paper"
        borderRadius={1}
        boxShadow={24}
        minWidth={400}
        margin="auto"
        mt={5}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={handleCloseModal} color="error">
            <CloseIcon style={{ fontSize: "32" }} />
          </IconButton>
        </Box>
        <Typography variant="h6" gutterBottom>
          Quotation Form
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <TextField
                label="Quotation Code"
                name="quotationCode"
                value={formData.quotationCode}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={!!formData.id}
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel
                  id="client-select-label"
                  style={{
                    color: colors.grey[100],
                  }}
                >
                  Client
                </InputLabel>
                <Select
                  labelId="client-select-label"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  label="Client"
                  fullWidth
                  required
                  disabled={!!formData.id}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.clientId} value={client.clientId}>
                      {client.clientName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={1}>
              <TextField
                label="Validity"
                name="validity"
                type="date"
                value={formData.validity}
                onChange={handleInputChange}
                fullWidth
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
              <TextField
                label="Terms Charge"
                name="termsCharge"
                value={formData.termsCharge}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  style: {
                    color: colors.grey[100],
                  },
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                label="Terms Buying"
                name="termsBuying"
                value={formData.termsBuying}
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
            </Grid>
            <Grid item xs={2.5}>
              <TextField
                label="Scope of Work"
                name="scopeOfWork"
                value={formData.scopeOfWork}
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
            </Grid>
            <Grid item xs={2.5}>
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
            </Grid>
          </Grid>
          <TextField
            label="Created By"
            name="createdBy"
            value={user}
            onChange={handleInputChange}
            fullWidth
            required
            autoComplete="off"
            style={{ display: "none" }}
          />
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ marginTop: "20px" }}
          >
            Quotation Wastes
          </Typography>
          <Box>
            {formData.quotationWastes.map((waste, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Waste Entry #{index + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={1.5}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`waste-type-select-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Type of Waste
                      </InputLabel>
                      <Select
                        labelId={`waste-type-select-label-${index}`}
                        name={`quotationWastes[${index}].wasteId`}
                        value={waste.wasteId}
                        onChange={(e) =>
                          handleWasteCodeChange(index, e.target.value)
                        }
                        label="Type of Waste"
                        fullWidth
                        required
                        InputLabelProps={{
                          style: {
                            color: colors.grey[100],
                          },
                        }}
                      >
                        {wasteTypes.map((wasteType) => (
                          <MenuItem key={wasteType.id} value={wasteType.id}>
                            {wasteType.wasteCode}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      label="Waste Name"
                      name={`quotationWastes[${index}].wasteName`}
                      value={waste.wasteName}
                      onChange={(e) =>
                        handleWasteInputChangeLocal(
                          index,
                          "wasteName",
                          e.target.value
                        )
                      }
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
                  <Grid item xs={1.5}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`mode-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Mode
                      </InputLabel>
                      <Select
                        labelId={`mode-label-${index}`}
                        name={`quotationWastes[${index}].mode`}
                        value={waste.mode}
                        onChange={(e) =>
                          handleWasteInputChangeLocal(
                            index,
                            "mode",
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        inputProps={{
                          name: `quotationWastes[${index}].mode`,
                          id: `mode-select-${index}`,
                        }}
                      >
                        {modeOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`unit-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Unit
                      </InputLabel>
                      <Select
                        labelId={`unit-label-${index}`}
                        name={`quotationWastes[${index}].unit`}
                        value={waste.unit}
                        onChange={(e) =>
                          handleWasteInputChangeLocal(
                            index,
                            "unit",
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        inputProps={{
                          name: `quotationWastes[${index}].unit`,
                          id: `unit-select-${index}`,
                        }}
                      >
                        {unitOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <TextField
                      label="Unit Price"
                      name={`quotationWastes[${index}].unitPrice`}
                      value={waste.unitPrice}
                      onChange={(e) =>
                        handleWasteInputChangeLocal(
                          index,
                          "unitPrice",
                          e.target.value
                        )
                      }
                      type="number"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`vat-calculation-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        VAT Calculation
                      </InputLabel>
                      <Select
                        labelId={`vat-calculation-label-${index}`}
                        name={`quotationWastes[${index}].vatCalculation`}
                        value={waste.vatCalculation}
                        onChange={(e) =>
                          handleWasteInputChangeLocal(
                            index,
                            "vatCalculation",
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        inputProps={{
                          name: `quotationWastes[${index}].vatCalculation`,
                          id: `vat-calculation-select-${index}`,
                        }}
                      >
                        {vatCalculationOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={0.5}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={waste.hasFixedRate}
                          onChange={(e) =>
                            handleWasteInputChangeLocal(
                              index,
                              "hasFixedRate",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Has Fixed Rate"
                    />
                  </Grid>

                  <Grid item xs={0.5} textAlign="right">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveWaste(index)}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Grid>
                  {waste.hasFixedRate && (
                    <>
                      <Grid item xs={1}>
                        <TextField
                          label="Fixed Weight"
                          name={`quotationWastes[${index}].fixedWeight`}
                          value={waste.fixedWeight}
                          onChange={(e) =>
                            handleWasteInputChangeLocal(
                              index,
                              "fixedWeight",
                              e.target.value
                            )
                          }
                          type="number"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField
                          label="Fixed Price"
                          name={`quotationWastes[${index}].fixedPrice`}
                          value={waste.fixedPrice}
                          onChange={(e) =>
                            handleWasteInputChangeLocal(
                              index,
                              "fixedPrice",
                              e.target.value
                            )
                          }
                          type="number"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            ))}
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <IconButton color="success" onClick={handleAddWaste}>
              <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ marginTop: "20px" }}
          >
            Quotation Transportation
          </Typography>
          <Box>
            {formData.quotationTransportation.map((transportation, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Transportation Entry #{index + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={1.5}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`transportation-type-select-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Type of Vehicle
                      </InputLabel>
                      <Select
                        labelId={`transportation-type-select-label-${index}`}
                        name={`quotationTransportation[${index}].vehicleTypeId`}
                        value={transportation.vehicleTypeId}
                        onChange={(e) =>
                          handleVehicleTypeChange(index, e.target.value)
                        }
                        label="Type of Waste"
                        fullWidth
                        required
                        InputLabelProps={{
                          style: {
                            color: colors.grey[100],
                          },
                        }}
                      >
                        {vehicleTypes.map((vehicleType) => (
                          <MenuItem key={vehicleType.id} value={vehicleType.id}>
                            {vehicleType.typeOfVehicle}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      label="Haling Area"
                      name={`quotationTransportation[${index}].haulingArea`}
                      value={transportation.haulingArea}
                      onChange={(e) =>
                        handleTransportationInputChangeLocal(
                          index,
                          "haulingArea",
                          e.target.value
                        )
                      }
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
                  <Grid item xs={1.5}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`mode-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Mode
                      </InputLabel>
                      <Select
                        labelId={`mode-label-${index}`}
                        name={`quotationTransportation[${index}].mode`}
                        value={transportation.mode}
                        onChange={(e) =>
                          handleTransportationInputChangeLocal(
                            index,
                            "mode",
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        inputProps={{
                          name: `quotationTransportation[${index}].mode`,
                          id: `mode-select-${index}`,
                        }}
                      >
                        {modeOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`unit-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        Unit
                      </InputLabel>
                      <Select
                        labelId={`unit-label-${index}`}
                        name={`quotationTransportation[${index}].unit`}
                        value={transportation.unit}
                        onChange={(e) =>
                          handleTransportationInputChangeLocal(
                            index,
                            "unit",
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        inputProps={{
                          name: `quotationTransportation[${index}].unit`,
                          id: `unit-select-${index}`,
                        }}
                      >
                        {unitOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <TextField
                      label="Unit Price"
                      name={`quotationTransportation[${index}].unitPrice`}
                      value={transportation.unitPrice}
                      onChange={(e) =>
                        handleTransportationInputChangeLocal(
                          index,
                          "unitPrice",
                          e.target.value
                        )
                      }
                      type="number"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth>
                      <InputLabel
                        id={`vat-calculation-label-${index}`}
                        style={{
                          color: colors.grey[100],
                        }}
                      >
                        VAT Calculation
                      </InputLabel>
                      <Select
                        labelId={`vat-calculation-label-${index}`}
                        name={`quotationTransportation[${index}].vatCalculation`}
                        value={transportation.vatCalculation}
                        onChange={(e) =>
                          handleTransportationInputChangeLocal(
                            index,
                            "vatCalculation",
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        inputProps={{
                          name: `quotationTransportation[${index}].vatCalculation`,
                          id: `vat-calculation-select-${index}`,
                        }}
                      >
                        {vatCalculationOptions.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={0.5}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={transportation.hasFixedRate}
                          onChange={(e) =>
                            handleTransportationInputChangeLocal(
                              index,
                              "hasFixedRate",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Has Fixed Rate"
                    />
                  </Grid>

                  <Grid item xs={0.5} textAlign="right">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveTransportation(index)}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Grid>
                  {transportation.hasFixedRate && (
                    <>
                      <Grid item xs={1}>
                        <TextField
                          label="Fixed Weight"
                          name={`quotationTransportation[${index}].fixedWeight`}
                          value={transportation.fixedWeight}
                          onChange={(e) =>
                            handleTransportationInputChangeLocal(
                              index,
                              "fixedWeight",
                              e.target.value
                            )
                          }
                          type="number"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField
                          label="Fixed Price"
                          name={`quotationTransportation[${index}].fixedPrice`}
                          value={transportation.fixedPrice}
                          onChange={(e) =>
                            handleTransportationInputChangeLocal(
                              index,
                              "fixedPrice",
                              e.target.value
                            )
                          }
                          type="number"
                          fullWidth
                          required
                          InputLabelProps={{
                            style: {
                              color: colors.grey[100],
                            },
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            ))}
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <IconButton color="success" onClick={handleAddTransportation}>
              <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default QuotationFormModal;

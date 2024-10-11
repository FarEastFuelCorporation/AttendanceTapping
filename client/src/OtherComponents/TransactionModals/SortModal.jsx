import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const SortModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
  setIsDiscrepancy,
  isDiscrepancy,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [quotations, setQuotations] = useState([]);
  const [scrapTypes, setScrapTypes] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const [quotationsResponse, scrapTypesResponse] = await Promise.all([
            axios.get(`${apiUrl}/api/quotation/${formData.clientId}`),
            axios.get(`${apiUrl}/api/scrapType`),
          ]);

          setQuotations(quotationsResponse.data.quotations);
          setScrapTypes(scrapTypesResponse.data.scrapTypes);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [open, formData.clientId]);

  useEffect(() => {
    const totalSortedWeight = calculateTotalSortedWeight(
      formData.sortedWastes,
      formData.sortedScraps
    );
    const discrepancyWeight = calculateDiscrepancyWeight(
      parseFloat(formData.batchWeight || 0),
      totalSortedWeight
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalSortedWeight,
      discrepancyWeight,
    }));
    if (discrepancyWeight === 0) {
      setIsDiscrepancy(false);
    } else {
      setIsDiscrepancy(true);
    }
  }, [
    formData.sortedWastes,
    formData.sortedScraps,
    formData.batchWeight,
    setFormData,
    setIsDiscrepancy,
  ]);

  const calculateTotalSortedWeight = (sortedWastes, sortedScraps) => {
    const totalSortedWasteWeight = sortedWastes.reduce((total, waste) => {
      return total + parseFloat(waste.weight || 0);
    }, 0);

    const totalSortedScrapWeight = sortedScraps.reduce((total, scrap) => {
      return total + parseFloat(scrap.weight || 0);
    }, 0);

    return totalSortedWasteWeight + totalSortedScrapWeight;
  };

  const calculateDiscrepancyWeight = (batchWeight, totalSortedWeight) => {
    return batchWeight - totalSortedWeight;
  };

  const handleWasteChange = useCallback(
    (index, field, value) => {
      const updatedSortedWastes = formData.sortedWastes.map((waste, i) =>
        i === index ? { ...waste, [field]: value } : waste
      );
      setFormData({
        ...formData,
        sortedWastes: updatedSortedWastes,
      });
    },
    [formData, setFormData]
  );

  const handleWasteCodeChange = useCallback(
    (index, value) => {
      let selectedWasteType = null;

      for (let quotation of quotations) {
        selectedWasteType = quotation.QuotationWaste.find(
          (waste) => waste.id === value
        );
        if (selectedWasteType) break;
      }

      if (selectedWasteType) {
        const updatedWastes = formData.sortedWastes.map((waste, i) =>
          i === index
            ? {
                ...waste,
                quotationWasteId: value,
                wasteName: selectedWasteType.wasteName,
              }
            : waste
        );
        handleInputChange({
          target: { name: "sortedWastes", value: updatedWastes },
        });
      } else {
        console.warn(`No waste type found for id: ${value}`);
      }
    },
    [quotations, formData, handleInputChange]
  );

  const handleScrapChange = useCallback(
    (index, field, value) => {
      const updatedSortedScraps = formData.sortedScraps.map((scrap, i) =>
        i === index ? { ...scrap, [field]: value } : scrap
      );
      setFormData({
        ...formData,
        sortedScraps: updatedSortedScraps,
      });
    },
    [formData, setFormData]
  );

  const handleScrapTypeChange = useCallback(
    (index, value) => {
      const selectedScrapType = scrapTypes.find((scrap) => scrap.id === value);

      if (selectedScrapType) {
        const updatedScraps = formData.sortedScraps.map((scrap, i) =>
          i === index
            ? {
                ...scrap,
                scrapTypeId: value,
              }
            : scrap
        );
        handleInputChange({
          target: { name: "sortedScraps", value: updatedScraps },
        });
      } else {
        console.warn(`No scrap type found for id: ${value}`);
      }
    },
    [scrapTypes, formData, handleInputChange]
  );

  const addWasteField = () => {
    setFormData({
      ...formData,
      sortedWastes: [
        ...formData.sortedWastes,
        {
          quotationWasteId: "",
          treatmentProcessId: "",
          wasteName: "",
          weight: 0,
          clientWeight: 0,
          formNo: "",
        },
      ],
    });
  };

  const removeWasteField = (index) => {
    const newSortedWastes = formData.sortedWastes.filter((_, i) => i !== index);
    setFormData({ ...formData, sortedWastes: newSortedWastes });
  };

  const addScrapField = () => {
    setFormData({
      ...formData,
      sortedScraps: [
        ...formData.sortedScraps,
        {
          scrapTypeId: "",
          weight: 0,
        },
      ],
    });
  };

  const removeScrapField = (index) => {
    const newSortedScraps = formData.sortedScraps.filter((_, i) => i !== index);
    setFormData({ ...formData, sortedScraps: newSortedScraps });
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
          width: 1200,
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
          {formData.id ? "Update Sorted Transaction" : "Sort Transaction"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <TextField
            label="Sort Date"
            name="sortedDate"
            value={formData.sortedDate}
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
            label="Sort Time"
            name="sortedTime"
            value={formData.sortedTime}
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
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Batch Weight"
              name={`batchWeight`}
              value={formData.batchWeight}
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
          <Grid item xs={4}>
            <TextField
              label="Total Sorted Weight"
              name={`totalSortedWeight`}
              value={formData.totalSortedWeight}
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
          <Grid item xs={4}>
            <TextField
              label="Discrepancy Weight"
              name={`discrepancyWeight`}
              value={formData.discrepancyWeight}
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
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "20px" }}>
          Sorted Wastes
        </Typography>
        {formData.sortedWastes.map((waste, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Waste Entry #{index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3.5}>
                <FormControl fullWidth>
                  <InputLabel
                    id={`waste-type-select-label-${index}`}
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId={`waste-type-select-label-${index}`}
                    name={`sortedWastes[${index}].quotationWasteId`}
                    value={waste.quotationWasteId || ""}
                    onChange={(e) =>
                      handleWasteCodeChange(index, e.target.value)
                    }
                    label="Category"
                    fullWidth
                    required
                  >
                    {quotations.map((quotation) =>
                      quotation.QuotationWaste.map((waste) => (
                        <MenuItem key={waste.id} value={waste.id}>
                          {waste.wasteName}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3.5}>
                <TextField
                  label="Waste Name"
                  name="wasteName"
                  value={waste.wasteName}
                  onChange={(e) =>
                    handleWasteChange(index, "wasteName", e.target.value)
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
                <TextField
                  label="Weight"
                  name="weight"
                  value={waste.weight}
                  onChange={(e) =>
                    handleWasteChange(index, "weight", e.target.value)
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
              <Grid item xs={1.5}>
                <TextField
                  label="Client Weight"
                  name="clientWeight"
                  value={waste.clientWeight}
                  onChange={(e) =>
                    handleWasteChange(index, "clientWeight", e.target.value)
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
              <Grid item xs={1.5}>
                <TextField
                  label="Form No"
                  name="formNo"
                  value={waste.formNo}
                  onChange={(e) =>
                    handleWasteChange(index, "formNo", e.target.value)
                  }
                  fullWidth
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={0.5}>
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
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "20px" }}>
          Sorted Scraps
        </Typography>
        {formData.sortedScraps.map((scrap, index) => (
          <Box key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Scrap Entry #{index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <FormControl fullWidth>
                  <InputLabel
                    id={`scrap-type-select-label-${index}`}
                    style={{
                      color: colors.grey[100],
                    }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId={`scrap-type-select-label-${index}`}
                    name={`sortedWastes[${index}].scrapTypeId`}
                    value={scrap.scrapTypeId}
                    onChange={(e) =>
                      handleScrapTypeChange(index, e.target.value)
                    }
                    label="Category"
                    fullWidth
                    required
                  >
                    {scrapTypes.map((scrapType) => (
                      <MenuItem key={scrapType.id} value={scrapType.id}>
                        {scrapType.typeOfScrap}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  label="Weight"
                  name="weight"
                  value={scrap.weight}
                  onChange={(e) =>
                    handleScrapChange(index, "weight", e.target.value)
                  }
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
              <Grid item xs={1.5}></Grid>
              <Grid item xs={1}>
                <IconButton
                  color="error"
                  onClick={() => removeScrapField(index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton color="success" onClick={addScrapField}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
        {isDiscrepancy && (
          <TextField
            label="Discrepancy Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            fullWidth
            required={isDiscrepancy}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
        )}
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
          {formData.id ? "Update" : "Sort"}
        </Button>
      </Box>
    </Modal>
  );
};

export default SortModal;

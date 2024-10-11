import React from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  useTheme,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { tokens } from "../../theme";

const WarehouseModalForm = (onSubmit) => {
  const { control, handleSubmit } = useFormContext(); // Access methods and state from the parent form
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Reusable styles
  const inputLabelStyles = {
    shrink: true,
    style: { color: colors.grey[100] },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={2}
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* Warehoused Date */}
        <Grid item xs={6}>
          <Controller
            name="warehousedDate"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Warehoused Date"
                type="date"
                fullWidth
                required
                autoComplete="off"
                InputLabelProps={inputLabelStyles}
              />
            )}
          />
        </Grid>
        {/* Warehoused Time */}
        <Grid item xs={6}>
          <Controller
            name="warehousedTime"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Warehoused Time"
                type="time"
                fullWidth
                required
                autoComplete="off"
                InputLabelProps={inputLabelStyles}
              />
            )}
          />
        </Grid>

        {/* Warehoused Items */}
        <Grid item xs={12}>
          <h3>Warehoused Items</h3>
          <Controller
            name="warehousedItems"
            control={control}
            defaultValue={[
              {
                gatePass: "",
                warehouse: "",
                area: "",
                section: "",
                level: "",
                palletNumber: "",
                steamNumber: "",
                quantity: 0,
                unit: "",
                description: "",
              },
            ]}
            render={({ field: { onChange, value } }) => (
              <>
                {value.map((item, index) => (
                  <Box key={index}>
                    <Typography my={1}>Item{index + 1}</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={6} lg={2}>
                        <TextField
                          label="Description"
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...value];
                            newItems[index].description = e.target.value;
                            onChange(newItems);
                          }}
                          fullWidth
                          required
                          autoComplete="off"
                          InputLabelProps={inputLabelStyles}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`unit-label-${index}`}
                            {...inputLabelStyles} // Apply the same input label styles
                          >
                            Unit
                          </InputLabel>
                          <Controller
                            name={`warehousedItems[${index}].unit`}
                            control={control}
                            defaultValue={item.unit}
                            rules={{ required: "Unit is required" }} // Optional validation
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId={`unit-label-${index}`}
                                fullWidth
                                autoComplete="off"
                                displayEmpty
                              >
                                <MenuItem value="" disabled>
                                  <em>Select</em>
                                </MenuItem>
                                <MenuItem value="KG">KG</MenuItem>
                                <MenuItem value="PC">PC</MenuItem>
                                <MenuItem value="CASE">CASE</MenuItem>
                                <MenuItem value="JUMBO">JUMBO</MenuItem>
                                <MenuItem value="POLYSACK">POLYSACK</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <TextField
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...value];
                            newItems[index].quantity = Number(e.target.value);
                            onChange(newItems);
                          }}
                          fullWidth
                          required
                          autoComplete="off"
                          InputLabelProps={inputLabelStyles}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <TextField
                          label="Gate Pass"
                          value={item.gatePass}
                          onChange={(e) => {
                            const newItems = [...value];
                            newItems[index].gatePass = e.target.value;
                            onChange(newItems);
                          }}
                          fullWidth
                          required
                          autoComplete="off"
                          InputLabelProps={inputLabelStyles}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1.5}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`warehouse-label-${index}`}
                            {...inputLabelStyles} // Apply the same input label styles
                          >
                            Warehouse
                          </InputLabel>
                          <Controller
                            name={`warehousedItems[${index}].warehouse`}
                            control={control}
                            defaultValue={item.unit}
                            rules={{ required: "Warehouse is required" }} // Optional validation
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId={`warehouse-label-${index}`}
                                fullWidth
                                autoComplete="off"
                                displayEmpty
                              >
                                <MenuItem value="" disabled>
                                  <em>Select</em>
                                </MenuItem>
                                <MenuItem value="WAREHOUSE 1">
                                  WAREHOUSE 1
                                </MenuItem>
                                <MenuItem value="WAREHOUSE 2">
                                  WAREHOUSE 2
                                </MenuItem>
                                <MenuItem value="WAREHOUSE 3">
                                  WAREHOUSE 3
                                </MenuItem>
                                <MenuItem value="WAREHOUSE A">
                                  WAREHOUSE A
                                </MenuItem>
                                <MenuItem value="WAREHOUSE B">
                                  WAREHOUSE B
                                </MenuItem>
                                <MenuItem value="WAREHOUSE C">
                                  WAREHOUSE C
                                </MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`area-label-${index}`}
                            {...inputLabelStyles} // Apply the same input label styles
                          >
                            Area
                          </InputLabel>
                          <Controller
                            name={`warehousedItems[${index}].area`}
                            control={control}
                            defaultValue={item.unit} // Ensure this is the correct initial value
                            rules={{ required: "Area is required" }} // Optional validation
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId={`area-label-${index}`}
                                fullWidth
                                autoComplete="off"
                                displayEmpty
                              >
                                <MenuItem value="" disabled>
                                  <em>Select</em>
                                </MenuItem>
                                {/* New options */}
                                <MenuItem value="A">A</MenuItem>
                                <MenuItem value="B">B</MenuItem>
                                <MenuItem value="C">C</MenuItem>
                                <MenuItem value="D">D</MenuItem>
                                <MenuItem value="E">E</MenuItem>
                                <MenuItem value="F">F</MenuItem>
                                <MenuItem value="G">G</MenuItem>
                                <MenuItem value="H">H</MenuItem>
                                <MenuItem value="I">I</MenuItem>
                                <MenuItem value="J">J</MenuItem>
                                <MenuItem value="K">K</MenuItem>
                                <MenuItem value="L">L</MenuItem>
                                <MenuItem value="M">M</MenuItem>
                                <MenuItem value="N">N</MenuItem>
                                <MenuItem value="O">O</MenuItem>
                                <MenuItem value="P">P</MenuItem>
                                <MenuItem value="Q">Q</MenuItem>
                                <MenuItem value="R">R</MenuItem>
                                <MenuItem value="S">S</MenuItem>
                                <MenuItem value="T">T</MenuItem>
                                <MenuItem value="U">U</MenuItem>
                                <MenuItem value="V">V</MenuItem>
                                <MenuItem value="W">W</MenuItem>
                                <MenuItem value="X">X</MenuItem>
                                <MenuItem value="Y">Y</MenuItem>
                                <MenuItem value="Z">Z</MenuItem>
                                <MenuItem value="AA">AA</MenuItem>
                                <MenuItem value="AB">AB</MenuItem>
                                <MenuItem value="AC">AC</MenuItem>
                                <MenuItem value="AD">AD</MenuItem>
                                <MenuItem value="AE">AE</MenuItem>
                                <MenuItem value="AF">AF</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`section-label-${index}`}
                            {...inputLabelStyles} // Apply the same input label styles
                          >
                            Section
                          </InputLabel>
                          <Controller
                            name={`warehousedItems[${index}].section`}
                            control={control}
                            defaultValue={item.unit} // Ensure this is the correct initial value
                            rules={{ required: "Section is required" }} // Optional validation
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId={`section-label-${index}`}
                                fullWidth
                                autoComplete="off"
                                displayEmpty
                              >
                                <MenuItem value="" disabled>
                                  <em>Select</em>
                                </MenuItem>
                                {/* New options */}
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="6">6</MenuItem>
                                <MenuItem value="7">7</MenuItem>
                                <MenuItem value="8">8</MenuItem>
                                <MenuItem value="9">9</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="11">11</MenuItem>
                                <MenuItem value="12">12</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <FormControl fullWidth required>
                          <InputLabel
                            id={`level-label-${index}`}
                            {...inputLabelStyles} // Apply the same input label styles
                          >
                            Level
                          </InputLabel>
                          <Controller
                            name={`warehousedItems[${index}].level`}
                            control={control}
                            defaultValue={item.unit} // Ensure this is the correct initial value
                            rules={{ required: "Level is required" }} // Optional validation
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId={`level-label-${index}`}
                                fullWidth
                                autoComplete="off"
                                displayEmpty
                              >
                                <MenuItem value="" disabled>
                                  <em>Select</em>
                                </MenuItem>
                                {/* New options */}
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <TextField
                          label="Pallet #"
                          value={item.palletNumber}
                          onChange={(e) => {
                            const newItems = [...value];
                            newItems[index].palletNumber = e.target.value;
                            onChange(newItems);
                          }}
                          fullWidth
                          required
                          autoComplete="off"
                          InputLabelProps={inputLabelStyles}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={1}>
                        <TextField
                          label="Steam Number"
                          value={item.steamNumber}
                          onChange={(e) => {
                            const newItems = [...value];
                            newItems[index].steamNumber = e.target.value;
                            onChange(newItems);
                          }}
                          fullWidth
                          autoComplete="off"
                          InputLabelProps={inputLabelStyles}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} lg={0.5}>
                        <IconButton
                          onClick={() => {
                            const newItems = value.filter(
                              (_, i) => i !== index
                            );
                            onChange(newItems);
                          }}
                          variant="contained"
                          color="error"
                        >
                          <RemoveCircleOutlineIcon sx={{ fontSize: 25 }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Box mt={2}>
                    <Button
                      onClick={() => {
                        const newItems = [
                          ...value,
                          {
                            gatePass: "",
                            warehouse: "",
                            area: "",
                            section: "",
                            level: "",
                            palletNumber: "",
                            steamNumber: "",
                            quantity: 0,
                            unit: "",
                            description: "",
                          },
                        ];
                        onChange(newItems);
                      }}
                      startIcon={<AddIcon />}
                      variant="contained"
                    >
                      Add Item
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          />
        </Grid>

        {/* Remarks */}
        <Grid item xs={12}>
          <Controller
            name="remarks"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Remarks"
                fullWidth
                InputLabelProps={inputLabelStyles}
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default WarehouseModalForm;

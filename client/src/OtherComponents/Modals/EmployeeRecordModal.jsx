import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Grid,
  Select,
  Autocomplete,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import CustomStepIcon from "../CustomStepIcon";

const EmployeeRecordModal = ({
  openModal,
  handleCloseModal,
  handleInputChange,
  formData,
  clearFormData,
  gender,
  handleGenderChange,
  handleCivilStatusChange,
  civilStatus,
  handlePictureChange,
  pictureFileName,
  handleSignatureChange,
  signatureFileName,
  currentStep,
  handleFormSubmit,
  setCurrentStep,
  errorMessage,
  showErrorMessage,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allCities, setAllCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [otherCities, setOtherCities] = useState([]);
  const [otherBarangays, setOtherBarangays] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          allCitiesResponse,
          provinceResponse,
          employeeResponse,
          departmentResponse,
        ] = await Promise.all([
          axios.get(`${apiUrl}/api/geoTable/city`),
          axios.get(`${apiUrl}/api/geoTable/province`),
          axios.get(`${apiUrl}/api/employee`),
          axios.get(`${apiUrl}/api/department`),
        ]);
        setAllCities(allCitiesResponse.data.cities);
        setProvinces(provinceResponse.data.provinces);
        setEmployeesData(employeeResponse.data.employees);
        setDepartments(departmentResponse.data.departments);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  const fetchCities = async (province) => {
    if (province) {
      try {
        const response = await axios.get(
          `${apiUrl}/api/geoTable/city/${province}`
        );
        setCities(response.data.cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setCities([]);
      setBarangays([]);
    }
    formData.municipality = null;
    formData.barangay = null;
  };

  const fetchBarangays = async (municipality) => {
    if (municipality) {
      try {
        const response = await axios.get(
          `${apiUrl}/api/geoTable/barangay/${municipality}`
        );
        setBarangays(response.data.barangays);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setBarangays([]);
    }
    formData.barangay = null;
  };

  const fetchOtherCities = async (province) => {
    if (province) {
      try {
        const response = await axios.get(
          `${apiUrl}/api/geoTable/city/${province}`
        );
        setOtherCities(response.data.cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setOtherCities([]);
      setBarangays([]);
    }
    formData.otherMunicipality = null;
    formData.otherBarangay = null;
  };

  const fetchOtherBarangays = async (municipality) => {
    if (municipality) {
      try {
        const response = await axios.get(
          `${apiUrl}/api/geoTable/barangay/${municipality}`
        );
        setOtherBarangays(response.data.barangays);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setOtherBarangays([]);
    }
    formData.otherBarangay = null;
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const steps = [
    "Personal Information",
    "Employment Details",
    "Family Background",
    "Educational Background",
    "Character Reference",
    "Notify In Case of Emergency",
    "Upload Files",
  ];

  return (
    <Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translate(-50%)",
            width: "75vw",
            height: "85%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {formData.id ? "Update Employee Record" : "Add Employee Record"}
          </Typography>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography variant="h6" component="h2" color="error">
            {showErrorMessage && errorMessage}
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              scrollbarWidth: "none",
              padding: 2,
            }}
          >
            {/* <StepContent /> */}
            {currentStep === 0 && (
              <Box>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Employee Id"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                      disabled={!!formData.id}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="gender-select-label"
                        style={{ color: colors.grey[100] }}
                        required
                      >
                        Gender
                      </InputLabel>
                      <Select
                        labelId="gender-select-label"
                        name="gender"
                        value={formData.gender}
                        onChange={handleGenderChange}
                        label="Gender"
                        fullWidth
                      >
                        <MenuItem value={"MALE"}>MALE</MenuItem>
                        <MenuItem value={"FEMALE"}>FEMALE</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="civilStatus-select-label"
                        style={{ color: colors.grey[100] }}
                        required
                      >
                        Civil Status
                      </InputLabel>
                      <Select
                        labelId="civilStatus-select-label"
                        name="civilStatus"
                        value={formData.civilStatus}
                        onChange={handleCivilStatusChange}
                        label="civilStatus"
                        fullWidth
                      >
                        <MenuItem value={"SINGLE"}>SINGLE</MenuItem>
                        <MenuItem value={"MARRIED"}>MARRIED</MenuItem>
                        <MenuItem
                          value={gender === "MALE" ? "WIDOWER" : "WIDOW"}
                        >
                          {gender === "MALE" ? "WIDOWER" : "WIDOW"}
                        </MenuItem>
                        <MenuItem value={"LIVE-IN"}>LIVE-IN</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Middle Name"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  {gender === "FEMALE" &&
                    (civilStatus === "MARRIED" || civilStatus === "WIDOW") && (
                      <Grid item xs={12} md={6} lg={3}>
                        <TextField
                          label="Husband's Surname"
                          name="husbandSurname"
                          value={formData.husbandSurname}
                          onChange={handleInputChange}
                          fullWidth
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          autoComplete="off"
                        />
                      </Grid>
                    )}
                  {gender === "MALE" && (
                    <Grid item xs={12} md={6} lg={3}>
                      <TextField
                        label="Affix"
                        name="affix"
                        value={formData.affix}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{
                          style: { color: colors.grey[100] },
                        }}
                        autoComplete="off"
                      />
                    </Grid>
                  )}
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Birthday"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      id="city-select"
                      options={allCities}
                      value={formData.birthPlace}
                      onChange={(event, newValue) => {
                        fetchBarangays(newValue);
                        handleInputChange({
                          target: { name: "birthPlace", value: newValue },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Place of Birth"
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          fullWidth
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="bloodType-select-label"
                        style={{ color: colors.grey[100] }}
                      >
                        Blood Type
                      </InputLabel>
                      <Select
                        labelId="bloodType-select-label"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        label="bloodType"
                        fullWidth
                      >
                        <MenuItem value={"A+"}>A+</MenuItem>
                        <MenuItem value={"A-"}>A-</MenuItem>
                        <MenuItem value={"B+"}>B+</MenuItem>
                        <MenuItem value={"B-"}>B-</MenuItem>
                        <MenuItem value={"AB+"}>AB+</MenuItem>
                        <MenuItem value={"AB-"}>AB-</MenuItem>
                        <MenuItem value={"O+"}>O+</MenuItem>
                        <MenuItem value={"O-"}>O-</MenuItem>
                        <MenuItem value={"UNKNOWN"}>Unknown</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Ethnic Origin"
                      name="ethnicOrigin"
                      value={formData.ethnicOrigin}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Citizenship"
                      name="citizenship"
                      value={formData.citizenship}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="religion-select-label"
                        style={{ color: colors.grey[100] }}
                        required
                      >
                        Religion
                      </InputLabel>
                      <Select
                        labelId="religion-select-label"
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                        label="Religion"
                        fullWidth
                      >
                        <MenuItem value={"AGLIPAYAN"}>AGLIPAYAN</MenuItem>
                        <MenuItem value={"BORN AGAIN"}>BORN AGAIN</MenuItem>
                        <MenuItem value={"CHRISTIAN"}>CHRISTIAN</MenuItem>
                        <MenuItem value={"IGLESIA NI CRISTO"}>
                          IGLESIA NI CRISTO
                        </MenuItem>
                        <MenuItem value={"ISLAM"}>ISLAM</MenuItem>
                        <MenuItem value={"JEHOVA'S WITNESS"}>
                          JEHOVA'S WITNESS
                        </MenuItem>
                        <MenuItem value={"ROMAN CATHOLIC"}>
                          ROMAN CATHOLIC
                        </MenuItem>
                        <MenuItem value={"SEVENTH DAY ADVENTIST"}>
                          SEVENTH DAY ADVENTIST
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" gutterBottom>
                  Present Address
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      id="province-select"
                      options={provinces}
                      value={formData.province}
                      onChange={(event, newValue) => {
                        fetchCities(newValue);
                        handleInputChange({
                          target: { name: "province", value: newValue },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Province"
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          fullWidth
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      id="city-select"
                      options={cities}
                      value={formData.municipality}
                      onChange={(event, newValue) => {
                        fetchBarangays(newValue);
                        handleInputChange({
                          target: { name: "municipality", value: newValue },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="City/Municipality"
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          fullWidth
                          required
                        />
                      )}
                      disabled={!formData.province}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      id="barangay-select"
                      options={barangays}
                      value={formData.barangay}
                      onChange={(event, newValue) => {
                        handleInputChange({
                          target: { name: "barangay", value: newValue },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Barangay"
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          fullWidth
                          required
                        />
                      )}
                      disabled={!formData.municipality}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="House No./Street Name/"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" gutterBottom>
                  Other Address
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      id="province-select"
                      options={provinces}
                      value={formData.otherProvince}
                      onChange={(event, newValue) => {
                        fetchOtherCities(newValue);
                        handleInputChange({
                          target: {
                            name: "otherProvince",
                            value: newValue,
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Province"
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          fullWidth
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      id="city-select"
                      options={otherCities}
                      value={formData.otherMunicipality}
                      onChange={(event, newValue) => {
                        fetchOtherBarangays(newValue);
                        handleInputChange({
                          target: {
                            name: "otherMunicipality",
                            value: newValue,
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="City/Municipality"
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          fullWidth
                          required
                        />
                      )}
                      disabled={!formData.otherProvince}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      id="barangay-select"
                      options={otherBarangays}
                      value={formData.otherBarangay}
                      onChange={(event, newValue) => {
                        handleInputChange({
                          target: {
                            name: "otherBarangay",
                            value: newValue,
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Barangay"
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          fullWidth
                          required
                        />
                      )}
                      disabled={!formData.otherMunicipality}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="House No./Street Name/"
                      name="otherAddress"
                      value={formData.otherAddress}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" gutterBottom>
                  Contact Information
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Mobile Number"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Landline Number"
                      name="landlineNumber"
                      value={formData.landlineNumber}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Email Address"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {currentStep === 1 && (
              <Box>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Date of Hire"
                      name="dateHire"
                      value={formData.dateHire}
                      onChange={handleInputChange}
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="employeeType-select-label"
                        style={{ color: colors.grey[100] }}
                        required
                      >
                        Employee Type
                      </InputLabel>
                      <Select
                        labelId="employeeType-select-label"
                        name="employeeType"
                        value={formData.employeeType}
                        onChange={handleInputChange}
                        label="Employee Type"
                        fullWidth
                      >
                        <MenuItem value={"REGULAR"}>REGULAR</MenuItem>
                        <MenuItem value={"PROBATIONARY"}>PROBATIONARY</MenuItem>
                        <MenuItem value={"PROJECT BASED"}>
                          PROJECT BASED
                        </MenuItem>
                        <MenuItem value={"CONTRACTUAL"}>CONTRACTUAL</MenuItem>
                        <MenuItem value={"PROJECT BASED"}>
                          PROJECT BASED
                        </MenuItem>
                        <MenuItem value={"CASUAL"}>CASUAL</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="payrollType-select-label"
                        style={{ color: colors.grey[100] }}
                        required
                      >
                        Payroll Type
                      </InputLabel>
                      <Select
                        labelId="payrollType-select-label"
                        name="payrollType"
                        value={formData.payrollType}
                        onChange={handleInputChange}
                        label="Payroll Type"
                        fullWidth
                      >
                        <MenuItem value={"SEMI-MONTHLY"}>SEMI-MONTHLY</MenuItem>
                        <MenuItem value={"WEEKLY"}>WEEKLY</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="salaryType-select-label"
                        style={{ color: colors.grey[100] }}
                        required
                      >
                        Salary Type
                      </InputLabel>
                      <Select
                        labelId="salaryType-select-label"
                        name="salaryType"
                        value={formData.salaryType}
                        onChange={handleInputChange}
                        label="Salary Type"
                        fullWidth
                      >
                        <MenuItem value={"CASH"}>CASH</MenuItem>
                        <MenuItem value={"ATM"}>ATM</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Autocomplete
                      id="department-select"
                      options={departments}
                      getOptionLabel={(option) =>
                        option.id === "" ? "" : option.department
                      }
                      value={
                        departments.find(
                          (department) =>
                            department.id === formData.departmentId
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        handleInputChange({
                          target: {
                            name: "departmentId",
                            value: newValue ? newValue.id : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Department"
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          fullWidth
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Autocomplete
                      options={employeesData}
                      getOptionLabel={(option) =>
                        option.employeeId === ""
                          ? ""
                          : `${option.firstName ? option.firstName : ""} ${
                              option.lastName ? option.lastName : ""
                            }`
                      }
                      value={
                        employeesData.find(
                          (employee) =>
                            employee.employeeId === formData.immediateHeadId
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        handleInputChange({
                          target: {
                            name: "immediateHeadId",
                            value: newValue ? newValue.employeeId : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Choose Immediate Head"
                          name="immediateHeadId"
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
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="TIN ID #"
                      name="tinId"
                      value={formData.tinId}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Philhealth ID #"
                      name="philhealthId"
                      value={formData.philhealthId}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="SSS ID #"
                      name="sssId"
                      value={formData.sssId}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      label="Pag-ibig ID #"
                      name="pagibigId"
                      value={formData.pagibigId}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {currentStep === 2 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Father's Information
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={8}>
                    <TextField
                      label="Father's Name"
                      name="fathersName"
                      value={formData.fathersName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Religion"
                      name="fathersReligion"
                      value={formData.fathersReligion}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <TextField
                      label="Address"
                      name="fathersAddress"
                      value={formData.fathersAddress}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Mobile Number"
                      name="fathersMobileNumber"
                      value={formData.fathersMobileNumber}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" gutterBottom>
                  Mother's Information
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={8}>
                    <TextField
                      label="Mother's Name"
                      name="mothersName"
                      value={formData.mothersName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Religion"
                      name="mothersReligion"
                      value={formData.mothersReligion}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <TextField
                      label="Address"
                      name="mothersAddress"
                      value={formData.mothersAddress}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Mobile Number"
                      name="mothersMobileNumber"
                      value={formData.mothersMobileNumber}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
                {civilStatus === "MARRIED" && (
                  <Box>
                    {" "}
                    <Typography variant="subtitle2" gutterBottom>
                      {gender === "MALE"
                        ? "Wife's Information"
                        : "Husband's Information"}
                    </Typography>
                    <Grid container spacing={2} mb={2}>
                      <Grid item xs={12} md={6} lg={8}>
                        <TextField
                          label={
                            gender === "MALE" ? "Wife's Name" : "Husband's Name"
                          }
                          name="spouseName"
                          value={formData.spouseName}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          autoComplete="off"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4}>
                        <TextField
                          label="Religion"
                          name="spouseReligion"
                          value={formData.spouseReligion}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          autoComplete="off"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={8}>
                        <TextField
                          label="Address"
                          name="spouseAddress"
                          value={formData.spouseAddress}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          autoComplete="off"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={4}>
                        <TextField
                          label="Mobile Number"
                          name="spouseMobileNumber"
                          value={formData.spouseMobileNumber}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          InputLabelProps={{
                            style: { color: colors.grey[100] },
                          }}
                          autoComplete="off"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
            {currentStep === 3 && (
              <Box>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="educationalAttainment-select-label"
                        style={{ color: colors.grey[100] }}
                        required
                      >
                        Educational Attainment
                      </InputLabel>
                      <Select
                        labelId="educationalAttainment-select-label"
                        name="educationalAttainment"
                        value={formData.educationalAttainment}
                        onChange={handleInputChange}
                        label="Employee Type"
                        fullWidth
                      >
                        <MenuItem value={"ELEMENTARY"}>ELEMENTARY</MenuItem>
                        <MenuItem value={"JUNIOR HIGH SCHOOL"}>
                          JUNIOR HIGH SCHOOL
                        </MenuItem>
                        <MenuItem value={"SENIOR HIGH SCHOOL"}>
                          SENIOR HIGH SCHOOL
                        </MenuItem>
                        <MenuItem value={"COLLEGE LEVEL"}>
                          COLLEGE LEVEL
                        </MenuItem>
                        <MenuItem value={"GRADUATE COURSE"}>
                          GRADUATE COURSE
                        </MenuItem>
                        <MenuItem value={"POST GRADUATE COURSE"}>
                          POST GRADUATE COURSE
                        </MenuItem>
                        <MenuItem value={"VOCATIONAL COURSE"}>
                          VOCATIONAL COURSE
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <TextField
                      label="School Name"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {currentStep === 4 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Reference # 1
                </Typography>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Name"
                      name="referenceName"
                      value={formData.referenceName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Address"
                      name="referenceAddress"
                      value={formData.referenceAddress}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Mobile Number"
                      name="referenceMobileNumber"
                      value={formData.referenceMobileNumber}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {currentStep === 5 && (
              <Box>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Name"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Address"
                      name="emergencyAddress"
                      value={formData.emergencyAddress}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      label="Mobile Number"
                      name="emergencyMobileNumber"
                      value={formData.emergencyMobileNumber}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: colors.grey[100] },
                      }}
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {currentStep === 6 && (
              <Box>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <input
                      type="file"
                      className="form-control visually-hidden"
                      accept="image/*"
                      onChange={handlePictureChange}
                      id="picture"
                      name="picture"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="picture">
                      <Typography>File: {pictureFileName}</Typography>
                      <Button
                        variant="contained"
                        component="span"
                        sx={{ mt: 2, backgroundColor: colors.primary[500] }}
                      >
                        Upload Employee Picture
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <input
                      type="file"
                      className="form-control visually-hidden"
                      accept="image/*"
                      onChange={handleSignatureChange}
                      id="signature"
                      name="signature"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="signature">
                      <Typography>File: {signatureFileName}</Typography>
                      <Button
                        variant="contained"
                        component="span"
                        sx={{ mt: 2, backgroundColor: colors.primary[500] }}
                      >
                        Upload Employee Signature
                      </Button>
                    </label>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Box>
              <Button variant="contained" color="error" onClick={clearFormData}>
                Clear
              </Button>
              <Button
                variant="contained"
                color={currentStep === steps.length - 1 ? "success" : "primary"}
                onClick={
                  currentStep === steps.length - 1
                    ? handleFormSubmit
                    : handleNext
                }
              >
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmployeeRecordModal;

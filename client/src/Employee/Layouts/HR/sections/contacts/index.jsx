import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Header from "../Header";
import axios from "axios";
import EmployeeRecordModal from "../../../../../OtherComponents/Modals/EmployeeRecordModal";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import EmployeeProfileModal from "../../../../../OtherComponents/Modals/EmployeeProfileModal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const Contacts = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    employeeId: "",
    employeeStatus: "ACTIVE",
    firstName: "",
    middleName: "",
    lastName: "",
    husbandSurname: "",
    affix: "",
    gender: "",
    civilStatus: "",
    birthday: "",
    birthPlace: "",
    bloodType: "",
    ethnicOrigin: "",
    citizenship: "",
    religion: "",
    province: "",
    municipality: "",
    barangay: "",
    address: "",
    otherProvince: "",
    otherMunicipality: "",
    otherBarangay: "",
    otherAddress: "",
    mobileNumber: "",
    landlineNumber: "",
    emailAddress: "",
    dateHire: "",
    employeeType: "",
    payrollType: "",
    salaryType: "",
    designation: "",
    departmentId: "",
    immediateHeadId: "",
    tinId: "",
    philhealthId: "",
    sssId: "",
    pagibigId: "",
    fathersName: "",
    fathersReligion: "",
    fathersAddress: "",
    fathersMobileNumber: "",
    mothersName: "",
    mothersReligion: "",
    mothersAddress: "",
    mothersMobileNumber: "",
    spouseName: "",
    spouseReligion: "",
    spouseAddress: "",
    spouseMobileNumber: "",
    educationalAttainment: "",
    schoolName: "",
    course: "",
    level: "",
    year: "",
    referenceName: "",
    referenceAddress: "",
    referenceMobileNumber: "",
    emergencyName: "",
    emergencyAddress: "",
    emergencyMobileNumber: "",
    picture: null,
    signature: null,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [employeeRecords, setEmployeeRecord] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(formData.gender);
  const [civilStatus, setCivilStatus] = useState(formData.civilStatus);
  const [pictureFile, setPictureFile] = useState(null);
  const [pictureFileName, setPictureFileName] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [signatureFileName, setSignatureFileName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [employeeRecordResponse, departmentResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/employeeRecord`),
        axios.get(`${apiUrl}/api/department`),
      ]);

      setEmployeeRecord(employeeRecordResponse.data.employeeRecords);
      setDepartments(departmentResponse.data.departments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employeeData:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentStep(0);
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const employeeRecord = employeeRecords.find((record) => record.id === id);

    setGender(employeeRecord.gender);
    setCivilStatus(employeeRecord.civilStatus);
    setPictureFileName("");
    setSignatureFile("");

    if (employeeRecord) {
      setFormData({
        id: employeeRecord.id,
        employeeId: employeeRecord.employeeId,
        employeeStatus: employeeRecord.employeeStatus,
        firstName: employeeRecord.firstName,
        middleName: employeeRecord.middleName,
        lastName: employeeRecord.lastName,
        husbandSurname: employeeRecord.husbandSurname,
        affix: employeeRecord.affix,
        gender: employeeRecord.gender,
        civilStatus: employeeRecord.civilStatus,
        birthday: employeeRecord.birthday,
        birthPlace: employeeRecord.birthPlace,
        bloodType: employeeRecord.bloodType,
        ethnicOrigin: employeeRecord.ethnicOrigin,
        citizenship: employeeRecord.citizenship,
        religion: employeeRecord.religion,
        province: employeeRecord.province,
        municipality: employeeRecord.municipality,
        barangay: employeeRecord.barangay,
        address: employeeRecord.address,
        otherProvince: employeeRecord.otherProvince,
        otherMunicipality: employeeRecord.otherMunicipality,
        otherBarangay: employeeRecord.otherBarangay,
        otherAddress: employeeRecord.otherAddress,
        mobileNumber: employeeRecord.mobileNumber,
        landlineNumber: employeeRecord.landlineNumber,
        emailAddress: employeeRecord.emailAddress,
        dateHire: employeeRecord.dateHire,
        employeeType: employeeRecord.employeeType,
        payrollType: employeeRecord.payrollType,
        salaryType: employeeRecord.salaryType,
        designation: employeeRecord.designation,
        departmentId: employeeRecord.departmentId,
        immediateHeadId: employeeRecord.immediateHeadId,
        tinId: employeeRecord.tinId,
        philhealthId: employeeRecord.philhealthId,
        sssId: employeeRecord.sssId,
        pagibigId: employeeRecord.pagibigId,
        fathersName: employeeRecord.fathersName,
        fathersReligion: employeeRecord.fathersReligion,
        fathersAddress: employeeRecord.fathersAddress,
        fathersMobileNumber: employeeRecord.fathersMobileNumber,
        mothersName: employeeRecord.mothersName,
        mothersReligion: employeeRecord.mothersReligion,
        mothersAddress: employeeRecord.mothersAddress,
        mothersMobileNumber: employeeRecord.mothersMobileNumber,
        spouseName: employeeRecord.spouseName,
        spouseReligion: employeeRecord.spouseReligion,
        spouseAddress: employeeRecord.spouseAddress,
        spouseMobileNumber: employeeRecord.spouseMobileNumber,
        educationalAttainment: employeeRecord.educationalAttainment,
        schoolName: employeeRecord.schoolName,
        course: employeeRecord.course,
        level: employeeRecord.level,
        year: employeeRecord.year,
        referenceName: employeeRecord.referenceName,
        referenceAddress: employeeRecord.referenceAddress,
        referenceMobileNumber: employeeRecord.referenceMobileNumber,
        emergencyName: employeeRecord.emergencyName,
        emergencyAddress: employeeRecord.emergencyAddress,
        emergencyMobileNumber: employeeRecord.emergencyMobileNumber,
        picture: employeeRecord.picture,
        signature: employeeRecord.signature,
        createdAt: employeeRecord.createdAt,
        createdBy: employeeRecord.createdBy,
        updatedAt: employeeRecord.updatedAt,
        updatedBy: employeeRecord.updatedBy,
        deletedAt: employeeRecord.deletedAt,
        deletedBy: employeeRecord.deletedBy,
      });
      handleOpenModal();
    } else {
      console.error(`Employee Record with ID ${id} not found for editing.`);
    }
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);
    handleInputChange(event);
  };

  const handleCivilStatusChange = (event) => {
    const selectedCivilStatus = event.target.value;
    setCivilStatus(selectedCivilStatus);
    handleInputChange(event);
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPictureFile(file);
      setPictureFileName(file.name);
    }
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignatureFile(file);
      setSignatureFileName(file.name);
    }
  };

  const validateForm = () => {
    let errors = [];

    // Destructure formData for easier validation
    const {
      employeeId,
      gender,
      civilStatus,
      firstName,
      lastName,
      birthday,
      birthPlace,
      citizenship,
      religion,
      province,
      municipality,
      barangay,
      address,
      otherProvince,
      otherMunicipality,
      otherBarangay,
      otherAddress,
      mobileNumber,
      emailAddress,
      dateHire,
      employeeType,
      payrollType,
      salaryType,
      designation,
      departmentId,
      immediateHeadId,
      tinId,
      philhealthId,
      sssId,
      pagibigId,
      fathersName,
      fathersReligion,
      fathersAddress,
      fathersMobileNumber,
      mothersName,
      mothersReligion,
      mothersAddress,
      mothersMobileNumber,
      spouseName,
      spouseReligion,
      spouseAddress,
      spouseMobileNumber,
      educationalAttainment,
      schoolName,
      course,
      level,
      year,
      referenceName,
      referenceAddress,
      referenceMobileNumber,
      emergencyName,
      emergencyAddress,
      emergencyMobileNumber,
    } = formData;

    if (!employeeId) errors.push("Employee Id is required");
    if (!gender) errors.push("Gender is required");
    if (!civilStatus) errors.push("Civil Status is required");
    if (!firstName) errors.push("First Name is required");
    if (!lastName) errors.push("Last Name is required");
    if (!birthday) errors.push("Birthday is required");
    if (!birthPlace) errors.push("Place of Birth is required");
    if (!citizenship) errors.push("Citizenship is required");
    if (!religion) errors.push("Religion is required");
    if (!province) errors.push("Province is required");
    if (!municipality) errors.push("City/Municipality is required");
    if (!barangay) errors.push("Barangay is required");
    if (!address) errors.push("House No./Street Name is required");
    if (!otherProvince) errors.push("Other Province is required");
    if (!otherMunicipality) errors.push("Other City/Municipality is required");
    if (!otherBarangay) errors.push("Other Barangay is required");
    if (!otherAddress) errors.push("Other House No./Street Name is required");
    if (!mobileNumber) errors.push("Mobile Number is required");
    if (!emailAddress) errors.push("Email Address is required");

    // Newly added required fields validation
    if (!dateHire) errors.push("Date of Hire is required");
    if (!employeeType) errors.push("Employee Type is required");
    if (!payrollType) errors.push("Payroll Type is required");
    if (!salaryType) errors.push("Salary Type is required");
    if (!designation) errors.push("Designation is required");
    if (!departmentId) errors.push("Department is required");
    if (!immediateHeadId) errors.push("Immediate Head is required");
    if (!tinId) errors.push("TIN ID # is required");
    if (!philhealthId) errors.push("Philhealth ID # is required");
    if (!sssId) errors.push("SSS ID # is required");
    if (!pagibigId) errors.push("Pag-ibig ID # is required");

    // Father's Information validation
    if (!fathersName) errors.push("Father's Name is required");
    if (!fathersReligion) errors.push("Father's Religion is required");
    if (!fathersAddress) errors.push("Father's Address is required");
    if (!fathersMobileNumber) errors.push("Father's Mobile Number is required");

    // Mother's Information validation
    if (!mothersName) errors.push("Mother's Name is required");
    if (!mothersReligion) errors.push("Mother's Religion is required");
    if (!mothersAddress) errors.push("Mother's Address is required");
    if (!mothersMobileNumber) errors.push("Mother's Mobile Number is required");

    // Spouse Information validation (if married)
    if (civilStatus === "MARRIED") {
      if (!spouseName)
        errors.push(
          `${gender === "MALE" ? "Wife's" : "Husband's"} Name is required`
        );
      if (!spouseReligion)
        errors.push(
          `${gender === "MALE" ? "Wife's" : "Husband's"} Religion is required`
        );
      if (!spouseAddress)
        errors.push(
          `${gender === "MALE" ? "Wife's" : "Husband's"} Address is required`
        );
      if (!spouseMobileNumber)
        errors.push(
          `${
            gender === "MALE" ? "Wife's" : "Husband's"
          } Mobile Number is required`
        );
    }

    // Educational Attainment validation
    if (!educationalAttainment)
      errors.push("Educational Attainment is required");
    if (!schoolName) errors.push("School Name is required");
    if (!course) errors.push("Course is required");
    if (!level) errors.push("Level is required");
    if (!year) errors.push("Year is required");

    // Reference Information validation
    if (!referenceName) errors.push("Reference Name is required");
    if (!referenceAddress) errors.push("Reference Address is required");
    if (!referenceMobileNumber)
      errors.push("Reference Mobile Number is required");

    // Emergency Contact validation
    if (!emergencyName) errors.push("Emergency Contact Name is required");
    if (!emergencyAddress) errors.push("Emergency Contact Address is required");
    if (!emergencyMobileNumber)
      errors.push("Emergency Contact Mobile Number is required");

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      setShowErrorMessage(true);
      return false;
    }
    setShowErrorMessage(false);
    setErrorMessage("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Perform client-side validation
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append form data fields to FormData object
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("employeeStatus", formData.employeeStatus);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("middleName", formData.middleName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("husbandSurname", formData.husbandSurname);
      formDataToSend.append("affix", formData.affix);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("civilStatus", formData.civilStatus);
      formDataToSend.append("birthday", formData.birthday);
      formDataToSend.append("birthPlace", formData.birthPlace);
      formDataToSend.append("bloodType", formData.bloodType);
      formDataToSend.append("ethnicOrigin", formData.ethnicOrigin);
      formDataToSend.append("citizenship", formData.citizenship);
      formDataToSend.append("religion", formData.religion);
      formDataToSend.append("province", formData.province);
      formDataToSend.append("municipality", formData.municipality);
      formDataToSend.append("barangay", formData.barangay);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("otherProvince", formData.otherProvince);
      formDataToSend.append("otherMunicipality", formData.otherMunicipality);
      formDataToSend.append("otherBarangay", formData.otherBarangay);
      formDataToSend.append("otherAddress", formData.otherAddress);
      formDataToSend.append("mobileNumber", formData.mobileNumber);
      formDataToSend.append("landlineNumber", formData.landlineNumber);
      formDataToSend.append("emailAddress", formData.emailAddress);
      formDataToSend.append("dateHire", formData.dateHire);
      formDataToSend.append("employeeType", formData.employeeType);
      formDataToSend.append("payrollType", formData.payrollType);
      formDataToSend.append("salaryType", formData.salaryType);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append(
        "departmentId",
        formData.departmentId.id
          ? formData.departmentId.id
          : formData.departmentId
      );
      formDataToSend.append(
        "immediateHeadId",
        formData.immediateHeadId.employeeId
          ? formData.immediateHeadId.employeeId
          : formData.immediateHeadId
      );
      formDataToSend.append("tinId", formData.tinId);
      formDataToSend.append("philhealthId", formData.philhealthId);
      formDataToSend.append("sssId", formData.sssId);
      formDataToSend.append("pagibigId", formData.pagibigId);
      formDataToSend.append("fathersName", formData.fathersName);
      formDataToSend.append("fathersReligion", formData.fathersReligion);
      formDataToSend.append("fathersAddress", formData.fathersAddress);
      formDataToSend.append(
        "fathersMobileNumber",
        formData.fathersMobileNumber
      );
      formDataToSend.append("mothersName", formData.mothersName);
      formDataToSend.append("mothersReligion", formData.mothersReligion);
      formDataToSend.append("mothersAddress", formData.mothersAddress);
      formDataToSend.append(
        "mothersMobileNumber",
        formData.mothersMobileNumber
      );
      formDataToSend.append("spouseName", formData.spouseName);
      formDataToSend.append("spouseReligion", formData.spouseReligion);
      formDataToSend.append("spouseAddress", formData.spouseAddress);
      formDataToSend.append("spouseMobileNumber", formData.spouseMobileNumber);
      formDataToSend.append(
        "educationalAttainment",
        formData.educationalAttainment
      );
      formDataToSend.append("schoolName", formData.schoolName);
      formDataToSend.append("course", formData.course);
      formDataToSend.append("level", formData.level);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("referenceName", formData.referenceName);
      formDataToSend.append("referenceAddress", formData.referenceAddress);
      formDataToSend.append(
        "referenceMobileNumber",
        formData.referenceMobileNumber
      );
      formDataToSend.append("emergencyName", formData.emergencyName);
      formDataToSend.append("emergencyAddress", formData.emergencyAddress);
      formDataToSend.append(
        "emergencyMobileNumber",
        formData.emergencyMobileNumber
      );
      formDataToSend.append("createdBy", formData.createdBy);

      // Append picture and signature if they are selected
      if (pictureFile) {
        formDataToSend.append("picture", pictureFile);
      }
      if (signatureFile) {
        formDataToSend.append("signature", signatureFile);
      }

      if (formData.id) {
        // Update existing employee record
        await axios.put(
          `${apiUrl}/api/employeeRecord/${formData.id}`,
          formDataToSend
        );

        setSuccessMessage("Employee Record Updated Successfully!");
      } else {
        // Add new employee record
        await axios.post(`${apiUrl}/api/employeeRecord`, formDataToSend);

        setSuccessMessage("Employee Record Added Successfully!");
      }

      fetchData();
      clearFormData();
      setErrorMessage("");
      setShowSuccessMessage(true);
      handleCloseModal();

      setLoading(false);
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center", width: "100%" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "employeeId",
      headerName: "Employee ID",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "picture",
      headerName: "Picture",
      align: "center",
      sortable: false,
      width: 70,
      headerAlign: "center",
      renderCell: (params) => {
        // Check if params.value is valid
        if (params.value && params.value.data && params.value.type) {
          try {
            // Convert Buffer to Uint8Array
            const uint8Array = new Uint8Array(params.value.data);
            // Create Blob from Uint8Array
            const blob = new Blob([uint8Array], { type: params.value.type });
            // Create object URL from Blob
            const imageUrl = URL.createObjectURL(blob);

            return (
              <img
                src={imageUrl}
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          } catch (error) {
            console.error("Error creating image URL:", error);
            return (
              <img
                src="/assets/unknown.png"
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          }
        } else {
          return (
            <img
              src="/assets/unknown.png"
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          );
        }
      },
    },
    {
      field: "employeeStatus",
      headerName: "Status",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 100,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "middleName",
      headerName: "Middle Name",
      width: 90,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 100,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "husbandSurname",
      headerName: "Husband Surname",
      width: 100,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "affix",
      headerName: "Affix",
      width: 50,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "civilStatus",
      headerName: "Civil Status",
      width: 100,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "birthday",
      headerName: "Birthday",
      width: 100,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "dateHire",
      headerName: "Date Hire",
      width: 100,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "designation",
      headerName: "Designation",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "departmentId",
      headerName: "Department",
      width: 150,
      headerAlign: "center",
      renderCell: (params) => {
        const department = departments.find(
          (department) => department.id === params.value
        );
        return department ? department.department : "(No Data)";
      },
    },
    {
      field: "mobileNumber",
      headerName: "Moblie Number",
      width: 150,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
  ];

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Employee Records"
          subtitle="List of Employee for Future Reference"
        />
        {user.userType === 9 && (
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
          rows={employeeRecords ? employeeRecords : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          {...(user.userType === 12 && { onRowClick: handleRowClick })}
        />
      </CustomDataGridStyles>
      <EmployeeRecordModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        formData={formData}
        clearFormData={clearFormData}
        handleGenderChange={handleGenderChange}
        gender={gender}
        handleCivilStatusChange={handleCivilStatusChange}
        civilStatus={civilStatus}
        handlePictureChange={handlePictureChange}
        pictureFileName={pictureFileName}
        handleSignatureChange={handleSignatureChange}
        signatureFileName={signatureFileName}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
      <EmployeeProfileModal
        selectedRow={selectedRow}
        open={open}
        openModal={openModal}
        handleClose={handleClose}
        handleEditClick={handleEditClick}
      />
    </Box>
  );
};

export default Contacts;

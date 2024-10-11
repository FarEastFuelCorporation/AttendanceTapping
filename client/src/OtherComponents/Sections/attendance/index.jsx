import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Box, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
import axios from "axios";
import { format } from "date-fns"; // Import date-fns for date formatting
import LoadingSpinner from "../../LoadingSpinner";
import timeInAudio from "../../../images/time-in.mp3";
import timeOutAudio from "../../../images/time-out.mp3"; // Renamed to avoid conflict with variable names
import CustomDataGridStyles from "../../CustomDataGridStyles";
import { formatTime } from "../../Functions";
import { tokens, themeSettings } from "../../../theme";

const Attendance = () => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18; // 6 AM to 6 PM
  const [mode, setMode] = useState(isDayTime ? "light" : "dark");
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showDataList, setShowDataList] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [employeeData, setEmployeeData] = useState({});
  const [picture, setPicture] = useState({});
  const [violationsData, setViolationsData] = useState([]);
  const [dataList, setdataList] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const debounceTimeout = useRef(null);
  const idleTimeout = useRef(null);
  const dataGridRef = useRef(null);

  // Audio refs
  const timeInRef = useRef(null);
  const timeOutRef = useRef(null);

  // Scroll to the bottom whenever the rows change
  useEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.scrollTop = dataGridRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      setMode(hour >= 6 && hour < 18 ? "light" : "dark");
    };

    // Update theme on initial load and every hour
    updateTheme();
    const intervalId = setInterval(updateTheme, 3600000); // Check every hour

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Fetch data function
  const fetchData = useCallback(
    async (inputId) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/api/attendance/${inputId}`
        );
        setAttendanceData(response.data.attendance);
        setEmployeeData(response.data.employeeData);
        setPicture(response.data.picture);
        setViolationsData(response.data.violations);
        setShowDataList(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setShowData(true);
      setLoading(false);
    },
    [apiUrl]
  );

  // Fetch data function
  const fetchDataList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/attendance`);

      const sortedData = response.data.filteredData.sort((a, b) => {
        // Convert `createdAt` to Date objects for both a and b
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        // Sort in descending order (latest dates first)
        return dateB - dateA;
      });

      setdataList(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [apiUrl]);

  // Handle form input change and submit (with debouncing)
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUrlInput(newValue);

    // Clear previous timeout if it exists
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Trigger fetching data after 500ms (debouncing)
    debounceTimeout.current = setTimeout(() => {
      if (newValue) {
        const urlParts = newValue.split("/");
        const idFromInput = urlParts[urlParts.length - 1]; // Extract ID from URL
        fetchData(idFromInput); // Call fetchData with the new ID
        setUrlInput("");
      }
    }, 10);
  };

  // Call fetchDataList when the component mounts
  useEffect(() => {
    fetchDataList();
  }, [fetchDataList]); //

  // Play audio based on attendance status change
  useEffect(() => {
    if (attendanceData.status === "TIME-IN") {
      timeInRef.current.play(); // Play "TIME-IN" audio
    } else if (attendanceData.status === "TIME-OUT") {
      timeOutRef.current.play(); // Play "TIME-OUT" audio
    }
  }, [attendanceData]);

  useEffect(() => {
    const resetIdleTimer = () => {
      // Clear any existing idle timeout
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }

      // Set a new idle timeout to refresh the page after 10 seconds of inactivity
      idleTimeout.current = setTimeout(() => {
        window.location.reload(); // Reload the page after 10 seconds of inactivity
      }, 10000);
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);

    // Start the idle timer immediately
    resetIdleTimer();

    // Cleanup event listeners and timeout on component unmount
    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }
    };
  }, []);

  // Define columns for DataGrid
  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "employeeId",
      headerName: "Employee ID",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "date",
      headerName: "Date",
      headerAlign: "center",
      align: "center",
      width: 250,
    },
    {
      field: "timeIn",
      headerName: "Time In",
      headerAlign: "center",
      align: "center",
      width: 175,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      width: 120,
    },
    // Add other fields as necessary
  ];

  // Prepare rows for DataGrid
  const rows = dataList.map((item, index) => {
    const createdAt = new Date(item.createdAt); // Parse the createdAt date
    const dateFormatted = format(createdAt, "MMMM dd, yyyy"); // Format date as 'October 10, 2024'
    const timeInFormatted = format(createdAt, "hh:mm:ss a"); // Format time as '12:00:00 AM'

    return {
      id: index + 1, // Ensure a unique id for each row
      employeeName: `${item.IdInformation.last_name}, ${item.IdInformation.first_name} ${item.IdInformation.middle_name}`,
      employeeId: item.employee_id,
      designation: item.IdInformation.designation,
      date: dateFormatted, // Add formatted date
      timeIn: timeInFormatted, // Adjusted timeIn
      timeInRaw: createdAt,
      status: item.status,
    };
  });

  return (
    <Box>
      {loading && <LoadingSpinner isLoading={loading} />}
      {/* Input for URL without form */}
      <input
        type="text"
        id="urlInput"
        name="urlInput"
        placeholder="Enter URL"
        value={urlInput}
        onChange={handleInputChange}
        autoFocus
        autoComplete="off"
        style={{ position: "absolute", top: "20px" }} // Position it as needed
      />

      <Box
        sx={{
          marginTop: "60px",
          left: 0,
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {showDataList && (
          <Box sx={{ width: "100%", paddingX: "40px" }}>
            <CustomDataGridStyles>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: "20px",
                }}
              >
                <Typography sx={{ fontSize: "40px" }}>
                  Employee On Duty
                </Typography>
                <Typography sx={{ fontSize: "40px" }}>
                  {dataList.length}
                </Typography>
              </Box>
              <DataGrid
                ref={dataGridRef}
                rows={rows}
                columns={columns}
                components={{
                  Footer: () => null, // Hide the footer
                }}
                sx={{
                  "& .MuiDataGrid-columnHeader": {
                    fontSize: "30px", // Change header font size
                  },
                  "& .MuiDataGrid-cell": {
                    fontSize: "30px", // Change cell font size
                  },
                }}
              />
            </CustomDataGridStyles>
          </Box>
        )}

        {showData && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              padding: "20px",
              height: "calc(100vh - 100px)",
            }}
          >
            {/* Left Side: Profile Picture */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <Box
                component="img"
                src={picture || "default_image.png"}
                alt="Profile Picture"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  border: "20px solid black",
                  borderRadius: "20px",
                  backgroundColor: "white",
                }}
              />
            </Box>

            {/* Right Side: Attendance and Info */}
            <Box
              sx={{
                display: "flex",
                padding: "20px",
                height: "100%",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                }}
              >
                {/* Attendance Status */}
                {attendanceData.status === "TIME-IN" && (
                  <Box
                    sx={{
                      backgroundColor: "green",
                      width: "100%",
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{ fontSize: "100px", fontWeight: "bold" }}
                    >
                      {attendanceData.status}
                    </Typography>
                  </Box>
                )}
                {attendanceData.status === "TIME-OUT" && (
                  <Box
                    sx={{
                      backgroundColor: "red",
                      width: "100%",
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{ fontSize: "100px", fontWeight: "bold" }}
                    >
                      {attendanceData.status}
                    </Typography>
                  </Box>
                )}

                {/* Attendance Time */}
                <Box>
                  <Typography
                    variant="h2"
                    align="center"
                    sx={{
                      fontSize: "100px",
                      color: colors.grey[100],
                      fontWeight: "bold",
                    }}
                  >
                    {formatTime(attendanceData.createdAt)}
                  </Typography>
                  <br />
                </Box>

                {/* Employee Name */}
                <Box>
                  <Typography
                    variant="h2"
                    align="center"
                    sx={{
                      fontSize: "100px",
                      color: colors.grey[100],
                      fontWeight: "bold",
                    }}
                  >
                    {employeeData.last_name},<br />
                    {employeeData.first_name}
                    <br />
                    {employeeData.middle_name}
                  </Typography>
                </Box>

                {/* Employee Designation */}
                <Box>
                  <Typography
                    variant="h2"
                    align="center"
                    sx={{
                      fontSize: "60px",
                      fontStyle: "italic",
                      color: colors.grey[100],
                      fontWeight: "bold",
                    }}
                  >
                    {employeeData.designation}
                  </Typography>
                </Box>

                <hr />

                {/* Violations */}
                {violationsData && violationsData.length > 0 ? (
                  <Box>
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{
                        fontSize: "60px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Violations:
                    </Typography>
                    <Box
                      component="ul"
                      sx={{
                        listStyle: "none",
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {violationsData.map((v, index) => (
                        <Box
                          component="li"
                          key={index}
                          sx={{ fontSize: "50px", color: "red" }}
                        >
                          {v.ViolationList.description}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{
                        fontSize: "60px",
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      No Violations
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* Audio elements */}
        <audio ref={timeInRef} src={timeInAudio} />
        <audio ref={timeOutRef} src={timeOutAudio} />
      </Box>
    </Box>
  );
};

export default Attendance;

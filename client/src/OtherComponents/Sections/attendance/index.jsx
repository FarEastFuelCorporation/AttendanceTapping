import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
import axios from "axios";
import { format } from "date-fns"; // Import date-fns for date formatting
import LoadingSpinner from "../../LoadingSpinner";
import birthday from "../../../images/birthday.mp4";
import happyBirthday from "../../../images/happyBirthday.mp4";
import timeInAudio from "../../../images/time-in.mp3";
import timeOutAudio from "../../../images/time-out.mp3"; // Renamed to avoid conflict with variable names
import CustomDataGridStyles from "../../CustomDataGridStyles";
import { formatTime } from "../../Functions";
import { tokens, ColorModeContext } from "../../../theme";

const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() && date.getMonth() === today.getMonth()
  );
};

const calculateAge = (birthday) => {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  // Adjust age if the birthday hasn't occurred this year yet
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }
  return age;
};

const Attendance = () => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18; // 6 AM to 6 PM

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showDataList, setShowDataList] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [employeeData, setEmployeeData] = useState({});
  const [picture, setPicture] = useState({});
  const [violationsData, setViolationsData] = useState([]);
  const [dataList, setdataList] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [birthdayCelebrants, setBirthdayCelebrants] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const debounceTimeout = useRef(null);
  const idleTimeout = useRef(null);
  const dataGridRef = useRef(null);

  // Audio refs
  const timeInRef = useRef(null);
  const timeOutRef = useRef(null);

  const toggleAudioAndVideo = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause the audio
      videoRef.current.pause(); // Pause the video
    } else {
      audioRef.current.currentTime = 0; // Reset audio to the beginning
      audioRef.current.play(); // Play the audio
      videoRef.current.play(); // Play the video
    }
    setIsPlaying(!isPlaying); // Toggle the playing state
  };

  // Set initial mode based on daytime
  useEffect(() => {
    if (isDayTime) {
      colorMode.toggleColorMode(); // Toggle to light mode if daytime
    } else {
      colorMode.toggleColorMode(); // Toggle to dark mode if nighttime
    }
  }, [isDayTime, colorMode]);

  // Effect to trigger when showData changes
  useEffect(() => {
    if (showData) {
      let timeoutId;

      if (isPlaying) {
        // Set timeout to update states after 5 seconds
        timeoutId = setTimeout(() => {
          setShowData(false);
          setShowDataList(true);
          toggleAudioAndVideo();
        }, 15000);
      } else {
        timeoutId = setTimeout(() => {
          setShowData(false);
          setShowDataList(true);
        }, 5000);
      }

      // Cleanup function to clear the timeout
      return () => clearTimeout(timeoutId);
    }
  }, [showData]);

  // Fetch data function
  const fetchData = useCallback(
    async (inputId) => {
      // setLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/api/attendance/${inputId}`
        );
        const birthday = new Date(
          response.data.employeeData.IdInformation.birthday
        );
        if (isToday(birthday)) {
          toggleAudioAndVideo();
        }

        setAttendanceData(response.data.attendance);
        setEmployeeData(response.data.employeeData);
        setPicture(response.data.picture);
        setViolationsData(response.data.violations);
        setShowDataList(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setShowData(true);
      // setLoading(false);
    },
    [apiUrl]
  );

  // Fetch data function
  const fetchDataList = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/attendance`);

      const sortedData = response.data.filteredData.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // Sort in descending order
      });

      const newBirthdayCelebrants = []; // Temp array to collect birthday celebrants

      const rows = sortedData.map((item, index) => {
        const createdAt = new Date(item.createdAt);
        const dateFormatted = format(createdAt, "MMMM dd, yyyy");
        const timeInFormatted = format(createdAt, "hh:mm:ss a");

        const birthday = new Date(item.IdInformation.birthday); // Parse birthday
        console.log(birthday);
        console.log(isToday(birthday));

        setIsPlayingVideo(false);

        // Check if the birthday is today
        if (isToday(birthday)) {
          const age = calculateAge(birthday); // Calculate age
          newBirthdayCelebrants.push({
            employeeId: item.employee_id,
            employeeName: `${item.IdInformation.last_name}, ${item.IdInformation.first_name} ${item.IdInformation.middle_name}`,
            designation: item.IdInformation.designation,
            age,
          });
        }

        return {
          id: index + 1,
          employeeName: `${item.IdInformation.last_name}, ${item.IdInformation.first_name} ${item.IdInformation.middle_name}`,
          employeeId: item.employee_id,
          designation: item.IdInformation.designation,
          date: dateFormatted,
          timeIn: timeInFormatted,
          timeInRaw: createdAt,
          status: item.status,
        };
      });

      console.log(newBirthdayCelebrants);

      setdataList(rows);
      setBirthdayCelebrants(newBirthdayCelebrants); // Set birthday celebrants once at the end

      // Set video playing state based on the presence of birthday celebrants
      setIsPlayingVideo(newBirthdayCelebrants.length > 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      }, 15000);
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

  const today = new Date();

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
      }}
    >
      {loading && <LoadingSpinner isLoading={loading} />}
      {/* Input for URL without form */}
      <audio ref={audioRef} src={happyBirthday} />
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
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {showDataList && (
          <Box sx={{ width: "100%", paddingX: "40px" }}>
            {isPlayingVideo && (
              <video
                src={birthday}
                autoPlay
                loop // Add this attribute to loop the video
                muted // Ensure the video is muted for auto-play
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  minWidth: "100%",
                  minHeight: "100%",
                  width: "auto",
                  height: "auto",
                  zIndex: -1,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
            {birthdayCelebrants.length > 0 && (
              <Box sx={{ paddingX: "20px", marginTop: "20px" }}>
                <Typography sx={{ fontSize: "40px" }}>
                  Birthday Celebrants: {format(today, "MMMM dd, yyyy")}
                </Typography>
                <ul style={{ fontSize: "30px", margin: 0 }}>
                  {birthdayCelebrants.map((celebrant, index) => (
                    <li
                      key={index}
                      className="blink.birthday"
                      style={{ color: "red" }}
                    >
                      <b>{celebrant.employeeName}</b> - Age: {celebrant.age} y/o
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            <CustomDataGridStyles>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: "20px",
                  marginTop: "-40px",
                }}
              >
                <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>
                  Employee On Duty
                </Typography>
                <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>
                  {dataList.length}
                </Typography>
              </Box>
              <Box ref={dataGridRef}>
                <DataGrid
                  rows={dataList}
                  columns={columns}
                  components={{
                    Footer: () => null, // Hide the footer
                  }}
                  sx={{
                    height: "90vh",
                    width: "100%",
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE 10+
                    "& .MuiDataGrid-columnHeader": {
                      fontSize: "30px", // Change header font size
                    },
                    "& .MuiDataGrid-cell": {
                      fontSize: "30px", // Change cell font size
                    },
                  }}
                />
              </Box>
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
            {isPlaying && (
              <video
                ref={videoRef}
                src={birthday}
                muted
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  minWidth: "100%",
                  minHeight: "100%",
                  width: "auto",
                  height: "auto",
                  zIndex: -1,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
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

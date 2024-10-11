import { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../Header";
import { tokens } from "../../../../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LineChart from "../LineChart";
import BarChart from "../BarChart";
import StatBox from "../StatBox";
import PieChart from "../PieChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faUserTag,
  faUserPen,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";

const Dashboard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true); // Add loading state
  const [regularEmployeeCount, setRegularEmployeeCount] = useState(0);
  const [regularEmployeeProgress, setRegularEmployeeProgress] = useState(0);
  const [probationaryEmployeeCount, setProbationaryEmployeeCount] = useState(0);
  const [probationaryEmployeeProgress, setProbationaryEmployeeProgress] =
    useState(0);
  const [projectBasedEmployeeCount, setProjectBasedEmployeeCount] = useState(0);
  const [projectBasedEmployeeProgress, setProjectBasedEmployeeProgress] =
    useState(0);
  const [totalEmployeeCount, setTotalEmployeeCount] = useState(0);
  const [expiredContractEmployeeCount, setExpiredContractEmployeeCount] =
    useState(0);
  const [expiredContractEmployees, setExpiredContractEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/hrDashboard/employee`);
        const data = await response.json();

        setRegularEmployeeCount(data.regularEmployeeCount);
        setProbationaryEmployeeCount(data.probationaryEmployeeCount);
        setProjectBasedEmployeeCount(data.projectBasedEmployeeCount);
        setTotalEmployeeCount(data.totalEmployee);
        setExpiredContractEmployeeCount(data.expiredContractEmployeeCount);
        setExpiredContractEmployees(data.expiredContractEmployees);

        // Calculate the progress based on the fetched counts
        setRegularEmployeeProgress(
          data.regularEmployeeCount / data.totalEmployee
        );
        setProbationaryEmployeeProgress(
          data.probationaryEmployeeCount / data.totalEmployee
        );
        setProjectBasedEmployeeProgress(
          data.projectBasedEmployeeCount / data.totalEmployee
        );

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching employeeData:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <Box m="20px">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>
      <Box>
        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* COUNTERS */}
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={regularEmployeeCount}
              subtitle="Regular Employee"
              progress={regularEmployeeProgress}
              progressColor="#00FF00"
              increase="+14%"
              icon={
                <FontAwesomeIcon
                  icon={faUserTie}
                  style={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={probationaryEmployeeCount}
              subtitle="Probationary Employee"
              progress={probationaryEmployeeProgress}
              progressColor="#FFFF00"
              increase="+21%"
              icon={
                <FontAwesomeIcon
                  icon={faUserTag}
                  style={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={projectBasedEmployeeCount}
              subtitle="Project Based Employee"
              progress={projectBasedEmployeeProgress}
              progressColor="#FF0000"
              increase="+5%"
              icon={
                <FontAwesomeIcon
                  icon={faUserPen}
                  style={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={totalEmployeeCount}
              subtitle="Total Employee"
              progress={regularEmployeeProgress}
              progress2={probationaryEmployeeProgress}
              progress3={projectBasedEmployeeProgress}
              progressColor="#00FF00"
              progressColor2="#FFFF00"
              progressColor3="#FF0000"
              increase="+43%"
              icon={
                <FontAwesomeIcon
                  icon={faUsers}
                  style={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          {/* ROW 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Average Company Monthly Salary For Employees 2023
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  P 268,125
                </Typography>
              </Box>
              <Box>
                <IconButton>
                  <DownloadOutlinedIcon
                    sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box height="250px" mt="-20px">
              <LineChart isDashboard={true} />
            </Box>
          </Box>

          {/* EXPIRED CONTRACTS */}
          <Box
            gridColumn="span 4"
            gridRow="span 4"
            backgroundColor={colors.primary[400]}
            height="100%"
            overflow="hidden"
            position="relative" // Ensure the container has relative positioning
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              color={colors.grey[100]}
              p="15px"
              position="sticky" // Make the header sticky
              top="0" // Stick to the top of the container
              zIndex="100" // Ensure it's above other content
              backgroundColor={colors.primary[400]} // Match container background
            >
              <Typography variant="h5" fontWeight="600">
                Expired Contracts ({expiredContractEmployeeCount})
              </Typography>
            </Box>
            <Box maxHeight="calc(100vh - 80px)" overflow="auto">
              {expiredContractEmployees.map((employee, i) => (
                <Box
                  key={`${employee.employeeId}-${i}`}
                  display="grid"
                  gridTemplateColumns="1fr 1fr 1fr" // Divide into 3 equal columns
                  gap="10px" // Add gap between grid items
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  {/* Column 1 */}
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {employee.employeeId}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {employee.firstName} {employee.lastName}
                    </Typography>
                  </Box>

                  {/* Column 2 */}
                  <Box color={colors.grey[100]} textAlign="center">
                    {employee.date_expire}
                  </Box>

                  {/* Column 3 */}
                  <Box p="5px 10px" borderRadius="4px" textAlign="center">
                    {employee.designation}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ROW 3 */}
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h5" fontWeight="600">
              Employee Count
            </Typography>
            <Box height="250px" mt="-20px">
              <PieChart isDashboard={true} />
            </Box>
          </Box>

          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ p: "30px 30px 0 30px" }}
            >
              Employee Recruitment
            </Typography>
            <Box height="250px" mt="-20px">
              <BarChart isDashboard={true} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import LoadingSpinner from "../../LoadingSpinner";

const SwitchUsers = ({ user, onUpdateUser }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
  const navigate = useNavigate(); // Initialize the navigate hook

  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Replace `user.id` with the actual ID
      const response = await axios.get(`${apiUrl}/api/switchUser/${user.id}`);

      const mappedData = response.data.employeeRolesOtherRole.map((data) => ({
        ...data,
        employeeRole: data.EmployeeRole.employeeRole,
      }));

      setEmployeeRoles(mappedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSwitchRole = async (row) => {
    try {
      setLoading(true);
      // Assuming you have an API endpoint to switch roles
      const response = await axios.put(`${apiUrl}/api/switchUser/${user.id}`, {
        roleId: row.employeeRoleId, // Example role data
      });

      if (response.status === 200) {
        // Update the user object with the new role
        const updatedUser = { ...user, userType: row.employeeRoleId };

        // Call onUpdateUser to update the parent component's user state
        onUpdateUser(updatedUser);

        // Redirect to the /dashboard route after successful role switch
        navigate("/dashboard");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error switching role:", error);
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "employeeRole",
      headerName: "Employee Role",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "switchRole",
      headerName: "Switch Role",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSwitchRole(params.row)}
        >
          Switch Role
        </Button>
      ),
    },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="User Role" subtitle="List of User roles" />
      </Box>

      <CustomDataGridStyles>
        <DataGrid
          rows={employeeRoles ? employeeRoles : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "typeOfVehicle", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
    </Box>
  );
};

export default SwitchUsers;

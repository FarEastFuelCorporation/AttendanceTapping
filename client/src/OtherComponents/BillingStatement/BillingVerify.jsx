import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import BillingStatementForm from "./BillingStatementForm";

const BillingVerify = () => {
  const [loading, setLoading] = useState(true); // State to indicate loading
  const apiUrl = process.env.REACT_APP_API_URL;
  const [billingData, setBillingData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login"); // Navigate back to the previous page
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const billingResponse = await axios.get(`${apiUrl}/api/billing/${id}`);

      setBillingData(billingResponse.data.billedTransaction.BookedTransaction);

      // Set a timeout of 5 seconds before setting loading to false
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [apiUrl, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ marginTop: "60px", display: "flex", justifyContent: "center" }}>
      <LoadingSpinner isLoading={loading} />
      {billingData ? (
        <BillingStatementForm row={billingData} verify={true} />
      ) : (
        <Box
          sx={{
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
          }}
        >
          <Typography variant="h4" color="textSecondary" gutterBottom>
            No Billing Statement Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We couldn't find the Billing Statement you're looking for.
          </Typography>
          <Button variant="contained" color="error" onClick={handleGoBack}>
            Go Back
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BillingVerify;

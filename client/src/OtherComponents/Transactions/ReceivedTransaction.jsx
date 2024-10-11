import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { format } from "date-fns";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString, formatWeight } from "../Functions";

const ReceivedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Extract received transaction data
  const receivedTransaction =
    row?.ScheduledTransaction?.[0].ReceivedTransaction?.[0] || {};

  return (
    <Box>
      {row.statusId === 2 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <LocalShippingIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[500]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              For Receiving
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <LocalShippingIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[100]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              Received
            </Typography>
            <Typography variant="h5">
              {receivedTransaction.createdAt
                ? timestampDate(receivedTransaction.createdAt)
                : ""}
            </Typography>
          </Box>
          <Typography variant="h5">
            Received Date:{" "}
            {receivedTransaction.receivedDate
              ? format(
                  new Date(receivedTransaction.receivedDate),
                  "MMMM dd, yyyy"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Received Time:{" "}
            {receivedTransaction.receivedTime
              ? format(
                  parseTimeString(receivedTransaction.receivedTime),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Permit To Transport No:{" "}
            {receivedTransaction.pttNo ? receivedTransaction.pttNo : "N/A"}
          </Typography>
          <Typography variant="h5">
            Manifest No:{" "}
            {receivedTransaction.manifestNo
              ? receivedTransaction.manifestNo
              : "N/A"}
          </Typography>
          <Typography variant="h5">
            Pull Out Form No:{" "}
            {receivedTransaction.pullOutFormNo
              ? receivedTransaction.pullOutFormNo
              : "N/A"}
          </Typography>
          <Typography variant="h5">
            Manifest Weight:{" "}
            {receivedTransaction.manifestWeight
              ? `${formatWeight(receivedTransaction.manifestWeight)} Kg`
              : "N/A"}
          </Typography>
          <Typography variant="h5">
            Client Weight:{" "}
            {receivedTransaction.clientWeight
              ? `${formatWeight(receivedTransaction.clientWeight)} Kg`
              : "N/A"}
          </Typography>
          <Typography variant="h5">
            Gross Weight: {formatWeight(receivedTransaction.grossWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Tare Weight: {formatWeight(receivedTransaction.tareWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Net Weight: {formatWeight(receivedTransaction.netWeight)} Kg
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {receivedTransaction.receivedRemarks
              ? receivedTransaction.receivedRemarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Received By:{" "}
            {`${receivedTransaction.Employee.firstName || ""} ${
              receivedTransaction.Employee.lastName || ""
            }`}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default ReceivedTransaction;

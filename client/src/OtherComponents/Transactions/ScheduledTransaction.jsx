import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import AlarmIcon from "@mui/icons-material/Alarm";
import { format } from "date-fns";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString } from "../Functions";

const ScheduledTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const scheduledData = row.ScheduledTransaction?.[0] || {};

  return (
    <Box sx={{ my: 3, position: "relative" }}>
      <CircleLogo pending={row.statusId === 1}>
        <AlarmIcon
          sx={{
            fontSize: "30px",
            color: row.statusId === 1 ? colors.grey[500] : colors.grey[100],
          }}
        />
      </CircleLogo>

      {row.statusId === 1 ? (
        <>
          <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
            For Schedule
          </Typography>
          <Typography variant="h5">Pending</Typography>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              Scheduled
            </Typography>
            <Typography variant="h5">
              {scheduledData?.createdAt
                ? timestampDate(scheduledData.createdAt)
                : ""}
            </Typography>
          </Box>
          <Typography variant="h5">
            Scheduled Date:{" "}
            {scheduledData?.billedDate
              ? format(new Date(scheduledData.scheduledDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Scheduled Time:{" "}
            {scheduledData?.billedTime
              ? format(parseTimeString(scheduledData.scheduledTime), "hh:mm aa")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {scheduledData?.remarks ? scheduledData.remarks : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Scheduled By:{" "}
            {`${scheduledData?.Employee?.firstName || ""} ${
              scheduledData?.Employee?.lastName || ""
            }`}
          </Typography>
        </>
      )}

      <br />
      <hr />
    </Box>
  );
};

export default ScheduledTransaction;

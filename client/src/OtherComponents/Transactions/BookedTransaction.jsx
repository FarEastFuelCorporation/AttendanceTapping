import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { format } from "date-fns";
import { CircleLogo } from "../CustomAccordionStyles";
import { tokens } from "../../theme";
import { timestampDate, parseTimeString } from "../Functions";

const BookedTransaction = ({ row }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box sx={{ my: 3, position: "relative" }}>
      <CircleLogo>
        <CollectionsBookmarkIcon
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
          Booked
        </Typography>
        <Typography variant="h5">
          {row.createdAt ? timestampDate(row.createdAt) : ""}
        </Typography>
      </Box>
      <Typography variant="h5">
        Hauling Date:{" "}
        {row.haulingDate
          ? format(new Date(row.haulingDate), "MMMM dd, yyyy")
          : ""}
      </Typography>
      <Typography variant="h5">
        Hauling Time:{" "}
        {row.haulingTime
          ? format(parseTimeString(row.haulingTime), "hh:mm aa")
          : ""}
      </Typography>
      <Typography variant="h5">
        Waste Name:{" "}
        {row.QuotationWaste.wasteName ? row.QuotationWaste.wasteName : ""}
      </Typography>
      <Typography variant="h5">
        Vehicle Type:{" "}
        {row.QuotationTransportation.VehicleType.typeOfVehicle
          ? row.QuotationTransportation.VehicleType.typeOfVehicle
          : ""}
      </Typography>
      <Typography variant="h5">
        Remarks: {row.remarks ? row.remarks : "NO REMARKS"}
      </Typography>
      <br />
      <hr />
    </Box>
  );
};

export default BookedTransaction;

import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import StepIcon, { stepIconClasses } from "@mui/material/StepIcon";
import { tokens } from "../theme"; // Adjust the import path as necessary

const CustomStepIcon = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const StyledIcon = styled(StepIcon)(({ theme }) => ({
    [`&.${stepIconClasses.root}`]: {
      fontSize: "2rem",
      color: colors.grey[800],
      "&.Mui-active": {
        color: colors.greenAccent[400],
      },
      "&.Mui-completed": {
        color: colors.grey[200],
      },
    },
    "& .MuiStepIcon-text": {
      fill: colors.grey[900],
      "&.Mui-completed": {
        fill: colors.grey[100], // Set the text color to black when the step is completed
      },
    },
  }));

  return <StyledIcon {...props} />;
};

export default CustomStepIcon;

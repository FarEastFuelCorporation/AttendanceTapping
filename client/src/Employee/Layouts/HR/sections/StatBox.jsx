import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({
  title,
  subtitle,
  icon,
  progress,
  progress2,
  progress3,
  progressColor,
  progressColor2,
  progressColor3,
  increase,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 20px">
      <Box display="flex" gap="10px">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle
            progress={progress}
            progress2={progress2}
            progress3={progress3}
            progressColor={progressColor}
            progressColor2={progressColor2}
            progressColor3={progressColor3}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
            {subtitle}
          </Typography>
          <Typography
            variant="h5"
            fontStyle="italic"
            sx={{ color: colors.greenAccent[600] }}
          >
            {/* {increase} */}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;

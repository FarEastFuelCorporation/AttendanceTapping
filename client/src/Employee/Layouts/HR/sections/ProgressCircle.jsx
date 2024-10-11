import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

const ProgressCircle = ({
  progress = "0",
  progress2 = null,
  progress3 = null,
  size = "40",
  progressColor,
  progressColor2,
  progressColor3,
}) => {
  // Convert progress to a number, defaulting to 0 if it's NaN
  const parsedProgress = isNaN(parseFloat(progress)) ? 0 : parseFloat(progress);

  // Convert progress2 and progress3 to numbers, defaulting to 0 if they're NaN or null
  const parsedProgress2 =
    progress2 !== null && !isNaN(parseFloat(progress2))
      ? parseFloat(progress2)
      : 0;
  const parsedProgress3 =
    progress3 !== null && !isNaN(parseFloat(progress3))
      ? parseFloat(progress3)
      : 0;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle1 = parsedProgress * 360;
  const angle2 = parsedProgress2 * 360;
  const angle3 = parsedProgress3 * 360;

  let backgroundStyle;

  // Determine the background style based on the presence of progress2 and progress3
  if (progress2 !== null && progress3 !== null) {
    // Case: progress, progress2, and progress3 all present
    backgroundStyle = {
      background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
        conic-gradient(
          ${progressColor} 0deg 
          ${angle1}deg, 
          ${progressColor2} ${angle1}deg 
          ${angle1 + angle2}deg, 
          ${progressColor3} ${angle1 + angle2}deg 
          ${angle1 + angle2 + angle3}deg, 
          ${colors.primary[500]} ${angle3}deg 
          360deg)`,
    };
  } else if (progress2 !== null) {
    // Case: progress and progress2 present
    backgroundStyle = {
      background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
          conic-gradient(transparent 0deg ${angle1}deg, ${progressColor} ${angle2}deg, ${progressColor2} 360deg)`,
    };
  } else {
    // Default case: Only progress present (same as original code)
    backgroundStyle = {
      background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
          conic-gradient(${progressColor} 0deg ${angle1}deg, ${colors.primary[500]} ${angle1}deg 360deg)`,
    };
  }

  return (
    <Box
      sx={{
        ...backgroundStyle,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;

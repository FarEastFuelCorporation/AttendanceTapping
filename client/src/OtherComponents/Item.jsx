import React from "react";
import { MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Item = ({ title, to, icon, selected, setSelected, collapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelected(title);
    navigate(to);
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        backgroundColor:
          selected === title ? colors.primary[500] : "transparent",
        display: "flex",
        alignItems: "center",
      }}
      onClick={handleClick}
      icon={icon}
    >
      {!collapsed && (
        <Typography
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {title}
        </Typography>
      )}
    </MenuItem>
  );
};

export default Item;

import React from "react";
import { Box, Modal, Button } from "@mui/material";

import WarehouseModalForm from "./WarehouseModalForm";

const WarehouseModal = ({ open, onClose, onSubmit }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 1400,
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h2>Warehoused Transaction</h2>
        <WarehouseModalForm onSubmit={onSubmit} />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {/* {formData.id ? "Update" : "Sort"} */}
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WarehouseModal;

import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loading = ({ fullScreen = false, processing }) => {
  if (processing) {
    return (
      <Box
        sx={{
          position: fullScreen ? "fixed" : "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backgroundColor: fullScreen ? "rgba(0, 0, 0, 0.3)" : "transparent",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return null;
};

export default Loading;

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: 3,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Typography variant="h1" color="error" gutterBottom sx={{fontWeight:'bold'}}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom sx={{fontWeight:'bold'}}>
        Page Not Found
      </Typography>
      <Typography variant="body1" mb={4}>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
            backgroundColor:'#879aad'
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;

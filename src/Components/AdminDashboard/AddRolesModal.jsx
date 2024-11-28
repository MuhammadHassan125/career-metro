import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import { Button, TextField } from "@mui/material";
import { Snackbar } from "../../Utils/SnackbarUtils";
import useFetch from "point-fetch-react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const AddRolesModal = ({ open, handleClose }) => {
  const { post, Data, setData, validate, Errors } = useFetch({
    state: {
      name: "",
    },
    rules: {
      name: ['required']
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };

  const handleAddRole = () => {
    if (validate()) {
      post({
        endPoint: `/create-role`,
        onSuccess: (res) => {
          Snackbar(res.data.message, {
            variant: "success",
            style: { backgroundColor: "var(--primary-btn-color)" },
          });
          setData("name", "");
          handleClose();
        },
        onError: (err) => {
          Snackbar(err.message, { variant: "error" });
        },
      });
    }

  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <IoMdClose
            onClick={handleClose}
            style={{
              float: "right",
              cursor: "pointer",
              fontSize: "20px",
              marginTop: "-20px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography id="transition-modal-title" variant="h4" component="h2">
              Add Role
            </Typography>

            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              sx={{
                height: 40,
                width: "100%",
                mb: 4,
                mt: 2,
              }}
              name="name"
              onChange={handleInputChange}
              value={Data.name}
            />
            {Errors.name && <p className="error" style={{ marginTop: "-10px" }}>{Errors.name}</p>}

            <Button
              onClick={handleAddRole}
              sx={{
                backgroundColor: "var(--primary-btn-color)",
                color: "white",
                fontSize: "12px",
                mt: 2,
                padding: "8px 25px",
                width: "100%",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddRolesModal;

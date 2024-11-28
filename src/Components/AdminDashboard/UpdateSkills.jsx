import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import { Button, TextField } from "@mui/material";
import useFetch from "point-fetch-react";
import { Snackbar } from "../../Utils/SnackbarUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
  fontFamily: "Poppins sans-serif",
};

const UpdateSkills = ({ open, handleClose, gettingSkillsList, skillRow }) => {

  const { post, Data, setData, Errors, validate } = useFetch({
    state: {
      title: skillRow?.title || "",
      status: skillRow?.status || "",
      step_id: skillRow?.step_id || null,
    },
    rules: {
      title: ['required'],
      status: ['required'],
    },
  });

  useEffect(() => {
    if (skillRow) {
      setData({
        title: skillRow?.title || "",
        status: skillRow?.status || "",
        step_id: skillRow?.step_id || null,
      });
    }
  }, [skillRow]);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };

  const updatePathPrompt = () => {
    if (validate()) {
      post({
        endPoint: `/update-skill-for-admin-panel/${skillRow?.id}`,
        onSuccess: (res) => {
          Snackbar(res?.data?.message, {
            variant: 'success',
            style: { backgroundColor: "var(--primary-btn-color)" },
          });
          handleClose();
          setData({
            title: "",
            status: "",
            step_id: null
          })
          gettingSkillsList();
        },
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      updatePathPrompt();
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
        <Box sx={style} onKeyDown={handleKeyDown}>
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
              gap: '10px'
            }}
          >
            <Typography id="transition-modal-title" variant="h3" component="h2"
              sx={{
                fontWeight: "semiBold"
              }}>
              Update Skills
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: "30px",
                width: "100%"
              }}
            >

              <TextField
                label="Update Title"
                variant="outlined"
                sx={{
                  height: 40,
                  width: "100%",
                  mt: 2,
                }}
                name="title"
                onChange={handleInputChange}
                value={Data.title}
              />
              {Errors.title && <p className="error">{Errors.title}</p>}

              <TextField
                label="Update Status"
                variant="outlined"
                sx={{
                  height: 40,
                  width: "100%",
                  mt: 1,
                  mb: 6
                }}
                name="status"
                onChange={handleInputChange}
                value={Data.status}

              />
              {Errors.status && <p className="error">{Errors.status}</p>}

            </Box>

            <Button
              onClick={updatePathPrompt}
              sx={{
                backgroundColor: "var(--primary-btn-color)",
                color: "white",
                fontSize: "12px",
                mt: -2,
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

export default UpdateSkills;

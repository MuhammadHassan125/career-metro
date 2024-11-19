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
  fontFamily: "Poppins sans-serif",
};

const UpdatePath = ({ open, handleClose, getPathList, pathId, prompt }) => {

  const { post, Data, setData, Errors, validate } = useFetch({
    state: {
      newPrompt: prompt || "",
    },
    rules:{
        newPrompt: ['required'],
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };

  useEffect(() => {
    setData("newPrompt", prompt || "");
  }, []);

  const updatePathPrompt = () => {
    if(validate()){
        post({
            endPoint:`/update-path-prompt-for-admin-panel/${pathId}`,
            onSuccess: (res) => {
                console.log(res, 'update path prompt');
                Snackbar(res?.data?.message, {
                    variant:'success',
                    style: { backgroundColor: "var(--primary-btn-color)" },
                })
                setData('newPrompt', '')
                handleClose();
                getPathList();
            },
            onError:(err) => {
                console.log(err)
            }
        })
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
              gap:'10px'
            }}
          >
            <Typography id="transition-modal-title" variant="h3" component="h2" 
            sx={{
              fontWeight:"semiBold"
            }}>
              Update your prompt
            </Typography>

          <Box
          sx={{
            display:"flex",
            alignItem:"center",
            flexDirection:"column",
            gap:"30px",
            width:"100%"
          }}
          >

            <TextField
              label="Update Prompt"
              variant="outlined"
              sx={{
                height: 40,
                width: "100%",
                mb: 6,
                mt: 2,
              }}
              name="newPrompt"
              onChange={handleInputChange}
              value={Data.newPrompt}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updatePathPrompt(); 
                }
              }}
            />
            {Errors.newPrompt && <p className="error">{Errors.newPrompt}</p>}
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

export default UpdatePath;

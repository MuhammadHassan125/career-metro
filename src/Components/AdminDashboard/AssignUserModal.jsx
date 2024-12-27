import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import { Button, TextField, Autocomplete } from "@mui/material";
import useFetch from "point-fetch-react";
import { Snackbar } from "../../Utils/SnackbarUtils";


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
  outline: "none",
};

const AssignUserModal = ({ open, handleClose, subAdminId }) => {
  const { setData, Data, post, get, Errors, validate } = useFetch({
    state: {
      userIds: [], 
      subAdminId: null
    },
    rules: {
      userIds: ["required"],
      subAdminId: ["required"]
    },
  });

  const [options, setOptions] = useState([]);

  useEffect(() => {
    setData({
      subAdminId: subAdminId
    })
  }, [subAdminId])
  const handleAutocompleteChange = (event, value) => {
    const userIds = value.map((user) => user.id);
    setData("userIds", userIds);
  };

  const handleQueryChange = async (event, value) => {
    const query = value || "";
    // if (query) {
    get({
      endPoint: `/searching-users`,
      onSuccess: (res) => {
        console.log(res, "fffffffffffff");
        setOptions(res?.data?.users || []);
      },
      onError: (err) => {
        console.log(err);
      },
    });
    // }
  };

  const handleAssignUserToSubAdmin = () => {
      post({
        endPoint: `/assign-users-to-subadmin`,
        data: {
          subAdminId,
          userIds: Data.userIds,        
        },
        onSuccess: (res) => {
          setData("password", "");
          setData("userId", null);
          handleClose();
          Snackbar(res?.data?.message, {
            variant: "success",
            style: { backgroundColor: "var(--primary-btn-color)" },
          });
        },
        onError: (err) => {
          Snackbar(err.error, { variant: "error" });
        },
      });
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
              fontFamily: "Poppins sans-serif",
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
            <Typography id="transition-modal-title" variant="h4" component="h2" sx={{fontWeight:'semiBold'}}>
              Assign SubAdmin To User
            </Typography>

            <Autocomplete
              multiple
              options={options}
              getOptionLabel={(option) => option.user || ""}
              onFocus={(event) => handleQueryChange(event, "")}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Users"
                  variant="outlined"
                  sx={{ width: "100%", mb: 1, }}
                />
              )}
              sx={{ width: "100%", mb: 2, mt: 3 }}
            />  

            <Button
              onClick={handleAssignUserToSubAdmin}
              sx={{
                backgroundColor: "var(--primary-btn-color)",
                color: "white",
                fontSize: "12px",
                mt: 2,
                padding: "8px 25px",
                width: "100%",
                "&:hover": {
                  opacity: 5,
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

export default AssignUserModal;

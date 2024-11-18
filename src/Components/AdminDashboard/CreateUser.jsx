import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import { Button, TextField } from "@mui/material";
import useFetch from "point-fetch-react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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

const CreateUser = ({ open, handleClose, stepId, getAllUser }) => {
  const [roles, setRoles] = useState([]);

  const { post, Data, setData, get, Errors, validate } = useFetch({
    state: {
      username: "",
      email: "",
      password: "",
      roleId: "",
    },
    rules:{
      email: ['required','email'],
      password: ['required', 'password'],
      username:['required'],
      roleId:['required']
    },
    message:{
      roleId:{
        required: 'Role must be selected',
      }
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };

  const handleGetRoles = () => {
    get({
      endPoint: `/get-role`,
      onSuccess: (res) => {
        console.log(res, "getting roles");
        setRoles(res?.data?.results);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const handleAddUser = () => {
    if (validate()) {
      post({
        endPoint: `/create-user`,
        body: { ...Data },
        onSuccess: (res) => {
          console.log(res);
          setData({
            username: "",
            email: "",
            password: "",
            roleId: "",
          });
          getAllUser();
          handleClose();
          Snackbar(res?.data?.message, {
            variant: "success",
            style: { backgroundColor: "var(--primary-btn-color)" },
          });
        },
        onError: (err) => {
          console.log(err);
          Snackbar(err, { variant: "error" });
        },
      });
    }
  };
  

  const handleRoleChange = (event) => {
    setData("roleId", event.target.value);
  };

  useEffect(() => {
    handleGetRoles();
  }, []);

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
              Add New User
            </Typography>

            <Typography sx={{ fontSize: "12px" }}>
              Super Admin only have access
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
              label="Username"
              variant="outlined"
              sx={{
                height: 40,
                width: "100%",
                // mb: 4,
                mt: 2,
              }}
              name="username"
              onChange={handleInputChange}
              value={Data.username}
            />
            {Errors.username && <p className="error">{Errors.username}</p>}

            <TextField
              label="Email"
              variant="outlined"
              sx={{
                height: 40,
                width: "100%",
                // mb: 4,
              }}
              name="email"
              onChange={handleInputChange}
              value={Data.email}
            />
           {Errors.email && <p className="error">{Errors.email}</p>}

            <TextField
              label="Password"
              variant="outlined"
              sx={{
                height: 40,
                width: "100%",
                // mb: 4,
              }}
              name="password"
              onChange={handleInputChange}
              value={Data.password}
            />
           {Errors.password && <p className="error">{Errors.password}</p>}


            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel>Assign Role</InputLabel>
              <Select
                value={Data.roleId}
                onChange={handleRoleChange}
                label="Assign Role"
              >
                {roles.map((role) => (
                  <MenuItem
                    key={role.id}
                    value={role.id}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
                {Errors.roleId && <p className="error">{Errors.roleId}</p>}
            </FormControl>

            </Box>

            <Button
              onClick={handleAddUser}
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

export default CreateUser;

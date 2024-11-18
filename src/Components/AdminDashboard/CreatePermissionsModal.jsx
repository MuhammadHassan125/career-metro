import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import { Button, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// import { Snackbar } from "../../Utils/SnackbarUtils";
import useFetch from "point-fetch-react";
import { Snackbar } from "../../Utils/SnackbarUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
const CreatePermissionsModal = ({
  open,
  handleClose,
  handleGetPermissionsList,
}) => {
  const { post, Data, setData, validate, Errors } = useFetch({
    state: {
      moduleName: "",
      permissions: [],
    },
    rules:{
      moduleName:['required'],
      permissions:['required']
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };

  const handleCreatePermissions = () => {
    if(validate()){
    post({
      endPoint: `/create-permission-with-module`,
      onSuccess: (res) => {
        console.log(res);
        setData("username", "email", "password", "");
        Snackbar(res?.data?.message, {
          variant: "success",
          style: { backgroundColor: "var(--primary-btn-color)" },
        })
        handleGetPermissionsList();
        handleClose();
      },
      onError: (err) => {
        console.log(err);
        Snackbar(err, {variant:'success'});
      },
    });
  }};

  const top100Films = [
    { title: "Index" },
    { title: "Create" },
    { title: "View" },
    { title: "Edit/Update" },
    { title: "Delete" },
  ];

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
              Create Permission
            </Typography>

            <TextField
              id="outlined-basic"
              label="moduleName"
              variant="outlined"
              sx={{
                height: 40,
                width: "100%",
                mb: 4,
                mt: 2,
              }}
              name="moduleName"
              onChange={handleInputChange}
              value={Data.moduleName}
            />
            {Errors.moduleName && <p className="error" style={{marginTop:"-10px", marginBottom:'10px'}}>{Errors.moduleName}</p>}

            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={top100Films}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              onChange={(event, newValue) => {
                setData(
                  "permissions",
                  newValue.map((option) => option.title)
                );
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props} style={{ height: 35 }}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </li>
              )}
              sx={{
                width: "100%",
                mb: 4,
                "& .MuiAutocomplete-listbox": {
                  maxHeight: 150,
                  overflowY: "auto",
                }, // Limits height and adds scroll to list
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Permissions"
                  placeholder="Add Permissions"
                />
              )}
            />
            {Errors.permissions && <p className="error" style={{marginTop:"-10px"}}>{Errors.permissions}</p>}

            <Button
              onClick={handleCreatePermissions}
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

export default CreatePermissionsModal;

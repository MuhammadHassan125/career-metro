import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import { Button, TextField } from "@mui/material";
import useFetch from "point-fetch-react";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Snackbar } from "../../Utils/SnackbarUtils";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

const UpdatePermissionsModal = (props, ref) => {
  const {
    open,
    handleClose,
    id,
    permissions,
    handleGetPermissionsList,
    getModuleName,
  } = props;

  const { post, setData, Data } = useFetch({
    state: {
      moduleId: id,
      moduleName: getModuleName || "",
      permissions: [],
    },
  });
  useImperativeHandle(ref, () => ({
    setData: (row, permissions) => {
      setData({
        moduleId: row.id,
        moduleName: row.moduleName,
        permissions: permissions.map((p) => ({
          id: p.permissionId,
          name: p.permissionName,
        })),
      });
    },
  }));

  const [top100Films, setTop100Films] = useState([
    "Index",
    "Create",
    "View",
    "Edit/Update",
    "Delete",
  ]);
  const handleModuleNameChange = (event) => {
    setData("moduleName", event.target.value);
  };

  const handleUpdatePermission = () => {
    post({
      endPoint: `/update-permission`,
      data: {
        moduleId: id,
        moduleName: Data.moduleName,
        permissions: Data.permissions.map((p) => ({
          id: p.id,
          name: p.name,
        })),
      },
      onSuccess: (res) => {
        console.log(res);
        setData("permissions", []);
        setData("moduleName", "");
        handleClose();
        Snackbar("Permissions has been updated successfully", {
          variant: "success",
          style: { backgroundColor: "var(--primary-btn-color)" },
        });
        handleGetPermissionsList();
      },
      onError: (err) => {
        console.log(err);
        Snackbar(err, { variant: "error" });
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
            <Typography
              sx={{ fontWeight: "semibold" }}
              id="transition-modal-title"
              variant="h4"
              component="h2"
            >
              Update Permission
            </Typography>

            <TextField
              sx={{
                width: "100%",
                margin: "20px 0",
              }}
              label="Module Name"
              value={Data.moduleName}
              onChange={handleModuleNameChange}
            />

            <Autocomplete
              sx={{
                width: "100%",
                marginBottom: "20px",
              }}
              multiple
              options={top100Films.filter(
                (item) => !Data.permissions.some((p) => p.name === item)
              )}
              getOptionLabel={(option) => option}
              value={Data.permissions.map((p) => p.name)}
              onChange={(event, newValue) => {
                const newPermissions = [
                  ...Data.permissions,
                  ...newValue
                    .filter(
                      (name) => !Data.permissions.some((p) => p.name === name)
                    )
                    .map((name) => ({ name })),
                ];
                setData("permissions", newPermissions);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Permissions"
                  placeholder="Update Permissions"
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option}>
                  <span>{selected ? checkedIcon : icon}</span>
                  {option}
                </li>
              )}
            />

            <Button
              variant="contained"
              sx={{
                marginTop: "10px",
                backgroundColor: "#879aad",
                color: "white",
                width: "100%",
              }}
              onClick={handleUpdatePermission}
            >
              Update Permission
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default forwardRef(UpdatePermissionsModal);

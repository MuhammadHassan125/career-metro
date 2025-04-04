import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import "./index.scss";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { baseURL } from "../../Utils/contants";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import PrimaryInput from "../../Components/PrimaryInput/index";
import PrimaryBtn from "../../Components/PrimaryBtn/index";
import axios from "axios";
import ChangePassword from "./ChangePassword";
import useFetch from "point-fetch-react";
import Loading from "../../Components/Loading";
import ProfileDetailsContext from "../../context/ProfileDetailContext";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 30,
  height: 30,
  border: `2px solid ${theme.palette.background.paper}`,
  cursor: "pointer",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 330,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

const Profile = () => {
  const { user, gettingProfileInfo } = useContext(ProfileDetailsContext);
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [newUsername, setNewUsername] = useState(user?.data?.username);

  const { put, Data, setData, Processing } = useFetch({
    state: {
      newUsername,
    },

    rules: {
      newUsername: "required",
    },
    message: {
      newUsername: {
        required: "Please provide new username",
      },
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUsernameChange = (event) => {
    setData((prev) => ({
      ...prev,
      newUsername: event.target.value,
    }));
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the limit of 5 MB");
      return;
    }

    setSelectedFile(file);
    if (file) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    if (!file) {
      setUploadMessage("Please select a file first");
      return;
    }
    const token = localStorage.getItem("user-visited-dashboard");
    if (!token) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${baseURL}/update-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUploadMessage(response.data.message);
      gettingProfileInfo();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file");
    }
  };

  const handleUpdateUsername = (event) => {
    event.preventDefault();

    put({
      endPoint: `/update-username`,
      data: { username: newUsername },
      onSuccess: (res) => {
        gettingProfileInfo();
        handleClose();
      },
      onError: (err) => {
        alert(err.error || "Failed to update username", { variant: "error" });
      },
    });
  };

  return (
    <React.Fragment>
      {Processing ? (
        <Loading fullScreen={true} processing={Processing} />
      ) : null}

      <div className="profile-details">
        <div className="profile-details__heading">
          <h2 >Your Profile Details</h2>
          <p style={{ marginBottom: "20px" }}>
            Hi {user?.data?.username}, Welcome to your profile settings
          </p>
        </div>

        <div className="details-box">
          <div className="image-box">
            <div>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <label htmlFor="upload-avatar">
                    <SmallAvatar alt="Upload" src="/images/upload.webp" />
                    <input
                      id="upload-avatar"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </label>
                }
              >
                <Avatar
                  alt={user?.data?.username}
                  src={user?.data?.profile_picture}
                  style={{ width: "70px", height: "70px" }}
                />
              </Badge>
            </div>

            <div>
              <h3>{user?.data?.username}</h3>
              <p>Your profile details.</p>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#879aad",
                  height: "24px",
                  width: "auto",
                  fontSize: "14px",
                  padding: "5px",
                  textTransform: "capitalize",
                }}
                onClick={handleOpen}
              >
                Update Username
              </Button>
            </div>
          </div>

          <h3 style={{ marginBottom: "5px" }}>Profile Information:</h3>
          <p style={{ marginBottom: "5px" }}>
            {` "Success is not final, failure is not fatal: It is the courage to
            continue that counts." - Winston Churchill.`}
          </p>
          <p style={{ marginBottom: "15px" }}>
            {` Welcome to your settings
            page. Here, you have the power to update your username and password
            to ensure your account remains secure and uniquely yours.`}
          </p>
          <div className="info-box">
            <h4>Email:</h4>
            <p>{user?.data?.email}</p>
          </div>

          <div className="info-box">
            <h4>Username:</h4>
            <p>{user?.data?.username}</p>
          </div>

          <hr />
          <div
            style={{
              width: "60%",
              marginTop: "40px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <ChangePassword />
          </div>
        </div>
      </div>

      {/* modal for update username */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleUpdateUsername}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h3">
              Update Username:
            </Typography>
            <div style={{ width: "100%", marginBottom: "10px" }}>
              <PrimaryInput
                type="text"
                value={newUsername}
                placeholder={user?.data?.username}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                text={"Update"}
                onClick={handleClose}
                style={{
                  padding: "0 12px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                }}
              >
                Cancel
              </button>
              <PrimaryBtn text={"Update"} type="submit" />
            </div>
          </Box>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default Profile;

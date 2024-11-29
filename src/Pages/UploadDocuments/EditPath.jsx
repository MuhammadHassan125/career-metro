import React, { useState, useEffect } from 'react';
import './index.scss';
import { TextField, InputAdornment } from '@mui/material';
import { MdOutlineClose } from "react-icons/md";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { IoMdClose } from "react-icons/io";
import { Button } from '@mui/material';
import { IoCheckmarkSharp } from "react-icons/io5";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { baseURL } from '../../Utils/contants';
import UploadDataGrid from '../../Components/DashboardComponents/DataGrid/UploadDataGrid';
import Loading from '../../Components/Loading';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import useFetch from 'point-fetch-react';

const columns = [
  { Header: "Id", accessor: "id" },
  { Header: "Prompt", accessor: "prompt" },
  { Header: "File Path", accessor: "file" },
  { Header: "Skills", accessor: "total_skill_count" },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => (
      <button style={{
        backgroundColor: value === 'analyzed' ? '#00B69B' : 'grey',
        border: 'none',
        outline: 'none',
        color: 'white',
        borderRadius: '10px',
        padding: '3px 10px',
        cursor: 'pointer',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </button>
    )
  }, { Header: "", accessor: "Btn" },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: 'none',
  outline: 'none',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const EditPath = () => {

  const location = useLocation();
  const params = useParams();

  const [success, setSuccess] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('1');
  const [prompt, setPrompt] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const [file, setFile] = useState(null);


  const navigate = useNavigate();
  const { Data, setData, Errors, post, put, validate, get, Processing } = useFetch(
    {
      state: {
        title: location.state?.title || '',
        prompt: location.state?.prompt || ''
      },
      rules: {
        title: ['required'],
        prompt: ['required']
      },
      message: {
        title: {
          required: 'Title field is required'
        },
        prompt: {
          required: 'Prompt field is required'
        },
      },
    }
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSuccess = (value) => {
    setSuccess(value);
  };

  const handleClose = () => {
    setSuccess(false);
  };

  const checkSubscription = () => {
    get({
      endPoint: `/check-path-subscription-limit`,
      onSuccess: (res) => {
        if (res?.data?.Subscription_Status === false) {
          navigate('/path');
          localStorage.setItem('subscription', false);
        } else {
          localStorage.removeItem('subscription');
        }
        return;
      }
    })
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpdate = async () => {
    const token = localStorage.getItem('user-visited-dashboard');
    if (!file) return alert('Please select a file');
    if (!token) return alert('Please upload a token');

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', Data.title);
      try {
        const response = await axios.put(`${baseURL}/update-path/${params.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        });
        handleSuccess();
        setFile(null);

      } catch (error) {
        console.log(err);
      }
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  }
  const handleUpdatePathWithPrompt = (e) => {
    e.preventDefault();
    if (validate()) {
      put({
        endPoint: `/update-path/${params.id}`,
        onSuccess: (res) => {
          setData({ title: '', prompt: '' });
          navigate('/path')
          handleClose();
        }
      })
    }
  };


  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
    checkSubscription();
  }, [success]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        handleOpen();
      }, 2000);

      return () => handleCloseModal();
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.prompt) {
      setPrompt(location.state.prompt || location.state.title);
    }
  }, [location.state.prompt]);

  return (
    <React.Fragment>
      {Processing ? <Loading processing={Processing} /> : null}
      <main className='documents-upload__section'>
        {success && (
          <div className='success__message'>
            <p>Resume file uploaded successfully!</p>
            <MdOutlineClose
              onClick={handleClose}
              style={{ cursor: 'pointer', fontSize: '18px' }}
            />
          </div>
        )}
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TextField id="standard-basic" label="Enter title" variant="standard"
            sx={{ width: '40%', height: '100%', position: 'relative', marginBottom: "30px", marginLeft: "25px" }}
            onChange={handleInput}
            name="title"
            value={Data.title || location.state?.title}
          />
          {Errors.title && <p className="error" style={{ marginLeft: "25px" }}>{Errors.title}</p>}

          <TabContext value={value}>
            <Box>

              <TabList onChange={handleChange} aria-label="lab API tabs example" sx={{ padding: '0 25px' }}>

                <Tab label="Add Path" value="1" sx={{ fontWeight: 700, fontFamily: "Nunito Sans, sans-serif" }} />
                <Tab label="Upload CV" value="2" sx={{ fontWeight: 700, fontFamily: "Nunito Sans, sans-serif" }} />

              </TabList>
            </Box>

            <TabPanel value="1" sx={{ position: "relative", mb: 5 }}>
              <TextField
                id="outlined-multiline-static"
                label="Enter Your Prompt"
                onChange={handleInput}
                name="prompt"
                value={Data.prompt || location.state?.prompt}
                multiline
                rows={6}
                defaultValue=""
                sx={{ width: '100%', height: '100%', position: 'relative' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                    </InputAdornment>
                  ),
                }}
              />
              <p style={{fontSize:"14px"}}><span style={{fontWeight: 700}}>Hint:</span> Include your country/location, industry/field, current job title, and career level for more tailored guidance.</p>

              {Errors.prompt && <p className="error">{Errors.prompt}</p>}
              <Button variant="contained"
                sx={{
                  cursor: "pointer",
                  position: 'absolute',
                  bottom: -10,
                  right: 25,
                  fontSize: '10px',
                  padding: "3px 5px",
                  backgroundColor: "#879aad"
                }}
                onClick={handleUpdatePathWithPrompt}
              >Submit</Button>
            </TabPanel>

            <TabPanel value="2" sx={{ position: "relative", mb: 3 }}>
              {/* <FileUpload onUploadSuccess={handleSuccess}/> */}
              <div className='file-upload__section' >
                <img src='/images/upload.png' alt='upload' />
                <label style={{ padding: '5px 10px', borderBottom: '1px solid #3749A6', cursor: 'pointer', color: '#879aad' }}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}

                  />
                  Click here to Browse.
                </label>
                {file && <p>{file.name}</p>}


              </div>
              <Button variant="contained"
                sx={{
                  cursor: "pointer",
                  fontSize: '10px',
                  padding: "3px 5px",
                  position: "absolute",
                  bottom: 15,
                  right: 25,
                  backgroundColor: "#879aad"
                }}
                onClick={handleFileUpdate}
              >
                Submit
              </Button>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleCloseModal}
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
                      onClick={handleCloseModal}
                      style={{ float: "right", cursor: "pointer", fontSize: "20px", marginTop: "-20px" }} />
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                      <Box
                        sx={{
                          padding: "18px 20px ",
                          borderRadius: "50%",
                          backgroundColor: "#ECF2FF",
                          marginBottom: "10px",
                          color: "#1E5EFF",
                          fontWeight: "800",
                          fontSize: "18px"
                        }}>
                        <IoCheckmarkSharp />
                      </Box>
                      <Typography id="transition-modal-title" variant="h5" component="h2" sx={{ fontWeight: "600" }}>
                        Import Successfull
                      </Typography>
                      <Typography id="transition-modal-description" sx={{ fontSize: "15px" }}>
                        Added 5 new skills to your path
                      </Typography>

                      <Button
                        onClick={handleCloseModal}
                        sx={{
                          backgroundColor: "#3749A6", color: 'white', fontSize: "12px", mt: 2, padding: "8px 25px",
                          '&:hover': {
                            backgroundColor: "#2e3a8c",
                          },
                        }}
                      >Continue</Button>
                    </Box>
                  </Box>
                </Fade>
              </Modal>
            </TabPanel>

          </TabContext>
        </Box>

        <UploadDataGrid columns={columns} heading={"Path Details"} dropdown={"October"} />

      </main>
    </React.Fragment>
  );
};

export default EditPath;

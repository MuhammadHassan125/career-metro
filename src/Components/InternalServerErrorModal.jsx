import { Modal, Box, Typography, Button } from '@mui/material';
import { FcCancel } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  border:'none',
  outline:'none',
  p: 4,
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  textAlign:'center'
};

const InternalServerErrorModal = ({open, handleClose}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    localStorage.removeItem('user-visited-dashboard');
    navigate('/login');
    handleClose();
  };
  
  return (
    <Modal open={open} onClose={handleNavigate}>
      <Box sx={style}>
      <FcCancel style={{fontSize:'3.4rem'}}/>
        <Typography variant="h6" component="h2">
            OOPS!
        </Typography>
        <Typography>
            something went wrong!
        </Typography>
        <Button onClick={handleNavigate} variant="contained" sx={{ mt: 2, backgroundColor:'red' }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default InternalServerErrorModal;

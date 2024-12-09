import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryBtn from '../Components/PrimaryBtn/index';
import { FiPlus } from "react-icons/fi";
import Loading from '../Components/Loading';
import PremiumModel from './PremiumModel';
import MapContext from '../context/MapContext';

const AddPathFromSinglePath = () => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {checkSubscription} = useContext(MapContext);
  
  const handleNavigate = () => {
    navigate('/add-path');
  };

  useEffect(() => {
      if (checkSubscription === false) {
      } else {
          null;
      }
  }, [checkSubscription]);

  return (
    <>
      <Loading />
      <PrimaryBtn text={"Add Path"} icon={<FiPlus />} onClick={handleNavigate} />
      {/* <button  
      className="primary-btn"
     type='submit'
     onClick={handleNavigate} 
     style={{backgroundColor: '#eb814b'}}
     >
      <FiPlus />
      Add Path
     </button> */}
      <PremiumModel open={open} handleClose={handleClose} />

    
    </>
  );
};

export default AddPathFromSinglePath;
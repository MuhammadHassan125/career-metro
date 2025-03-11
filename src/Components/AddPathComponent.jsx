import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryBtn from '../Components/PrimaryBtn/index';
import { FiPlus } from "react-icons/fi";
import Loading from '../Components/Loading';
import PremiumModel from './PremiumModel';
import MapContext from '../context/MapContext';
import Fire from '../Fire/Fire';
import { baseURL } from '../Utils/contants';

const AddPathComponent = () => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {checkSubscription} = useContext(MapContext);
  const authToken = localStorage.getItem("user-visited-dashboard");

  const checkRemainingPlans = () => {
      if (!authToken) return;
      Fire.get({
        url: `${baseURL}/check-remaining-plans`,
        onSuccess: (res) => {
          console.log(res?.data?.RemainingPrompts, 'fffffffffff res')
          // setCheckData(res?.data || []);
        },
        onError: (err) => {
          setCheckData([]);
          console.log(err)
        },
      });
    };
  
    const handleNavigate = () => {
      return checkRemainingPlans();
    }

  // useEffect(() => {
  //     if (checkSubscription === false) {
  //     } else {
  //         null;
  //     }
  // }, [checkSubscription]);

  return (
    <>
      <Loading />
      {/* <PrimaryBtn text={"Add Path"} icon={<FiPlus />} onClick={handleNavigate} color={'#eb814b'}/> */}
      <button  
      className="primary-btn"
     type='submit'
     onClick={handleNavigate} 
     style={{backgroundColor: '#eb814b'}}
     >
      <FiPlus />
      Add Path
     </button>
      <PremiumModel open={open} handleClose={handleClose} />

    
    </>
  );
};

export default AddPathComponent;
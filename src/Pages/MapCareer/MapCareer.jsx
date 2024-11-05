import React, { useContext, useEffect, useState } from 'react'
import './index.scss'
import UserDetailsMap from './UserDetailsMap';
import AddPathComponent from '../../Components/AddPathComponent';
import MapContext from '../../context/MapContext';
import PremiumModel from '../../Components/PremiumModel';

const MapCareer = () => {

    // const {checkSubscription} = useContext(MapContext);
    // const [open, setOpen] = useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
  
    // useEffect(() => {
    //     if (checkSubscription === false) {
    //         handleOpen();
    //     } else {
    //         handleClose();
    //     }
    // }, [checkSubscription]);

    return (
        <React.Fragment>
            <main className='map-section'>
                {/* heading div  */}
                <div className='main__heading'>
                    <div>
                        <h2>Map Career Path</h2>
                    </div>
                    <div className='map-section__btn-div'>
                        <p><strong>Sales Rep </strong>/ 19 Paths</p>
                       
                        <AddPathComponent />
                    </div>
                </div>

                <UserDetailsMap />

                {/* <PremiumModel open={open} handleClose={handleClose} /> */}

            </main>

        </React.Fragment>
    )
};

export default MapCareer
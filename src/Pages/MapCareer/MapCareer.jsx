import React, { useContext, useEffect, useState } from 'react'
import './index.scss'
import UserDetailsMap from './UserDetailsMap';
import AddPathComponent from '../../Components/AddPathComponent';
import MapContext from '../../context/MapContext';
import PremiumModel from '../../Components/PremiumModel';

const MapCareer = () => {

    return (
        <React.Fragment>
            <main className='map-section'>
                {/* heading div  */}
                <div className='main__heading'>
                    <div>
                        <h2>Map Career Path</h2>
                    </div>
                    <div className='map-section__btn-div'>
                        {/* <p>19 Paths</p> */}
                       
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
import React, { useEffect, useState } from 'react';
import './index.scss';
import UploadDataGrid from '../../Components/DashboardComponents/DataGrid/UploadDataGrid';
import PaymentCheckout from '../PaymentCheckout/index.jsx';

const Path = () => {
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);

    useEffect(() => {
        const status = localStorage.getItem('subscription');
        setSubscriptionStatus(status === 'false'); 
        console.log(status);
    }, []);

    return (
        <React.Fragment>
            <main className='path-section' style={{ marginBottom: '25px' }}>
                <h2>Listing Documents</h2>
                <UploadDataGrid heading={"Uploaded Documents"} dropdown={"October"} />
            </main>
            
            {subscriptionStatus ? <PaymentCheckout /> : null} 
        </React.Fragment>
    );
}

export default Path;
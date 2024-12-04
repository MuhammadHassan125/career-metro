import React, { useEffect, useState } from 'react';
import './index.scss';
import UploadDataGrid from '../../Components/DashboardComponents/DataGrid/UploadDataGrid';
import PaymentCheckout from '../PaymentCheckout/index.jsx';
import useFetch from 'point-fetch-react';

const Path = () => {
  const [checkPlanStatus, setCheckPlanStatus] = useState(null);

  const { get } = useFetch({ state: {} });

  const checkSubscription = () => {
    get({
      endPoint: `/check-path-subscription-limit`,
      onSuccess: (res) => {
        if (res?.data?.Subscription_Status === false) {
          setCheckPlanStatus(false);
        } else {
          setCheckPlanStatus(true);
        }
      },
      onError: (err) => {
        console.error('Error checking subscription:', err);
      },
    });
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return (
    <React.Fragment>
      <main className='path-section' style={{ marginBottom: '25px' }}>
        <h2>Historical Prompts</h2>
        <UploadDataGrid heading={'Previous Entries'} dropdown={'October'} />
      </main>

      {checkPlanStatus === false && <PaymentCheckout />}
    </React.Fragment>
  );
};

export default Path;

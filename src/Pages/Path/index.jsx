// import React, { useContext, useEffect, useState } from 'react';
// import './index.scss';
// import UploadDataGrid from '../../Components/DashboardComponents/DataGrid/UploadDataGrid';
// import PaymentCheckout from '../PaymentCheckout/index.jsx';
// import useFetch from 'point-fetch-react';
// import MapContext from '../../context/MapContext.jsx';

// const Path = () => {
//   // const [checkPlanStatus, setCheckPlanStatus] = useState(null);

//   const { get } = useFetch({ state: {} });
//   const {checkingPlanStatus, setCheckingPlanStatus} = useContext(MapContext);

//   const checkSubscription = () => {
//     get({
//       endPoint: `/check-path-subscription-limit`,
//       onSuccess: (res) => {
//         if (res?.data?.Subscription_Status === false) {
//           // setCheckPlanStatus(false);
//           setCheckingPlanStatus(false);
//           // localStorage.setItem('subscription', false);
//         } else {
//           // setCheckPlanStatus(true);
//           localStorage.setItem('subscription', true);
//           setCheckingPlanStatus(true);
//         }
//       },
//       onError: (err) => {
//         console.error('Error checking subscription:', err);
//       },
//     });
//   };

//   useEffect(() => {
//     checkSubscription();
//   }, []);

//   console.log(checkingPlanStatus, 'fffffffffakjsdjnqadlqwds qk')

//   return (
//     <React.Fragment>
//       <main className='path-section' style={{ marginBottom: '25px' }}>
//         <h2>Historical Prompts</h2>
//         <UploadDataGrid heading={'Previous Entries'} dropdown={'October'} />
//       </main>

//       {checkingPlanStatus === false && <PaymentCheckout />}
//     </React.Fragment>
//   );
// };

// export default Path;




import React, { useContext, useEffect } from 'react';
import './index.scss';
import UploadDataGrid from '../../Components/DashboardComponents/DataGrid/UploadDataGrid';
import PaymentCheckout from '../PaymentCheckout/index.jsx';
import useFetch from 'point-fetch-react';
import MapContext from '../../context/MapContext.jsx';

const Path = () => {
  const { get } = useFetch({ state: {} });
  const { checkingPlanStatus, setCheckingPlanStatus } = useContext(MapContext);

  const checkSubscription = () => {
    get({
      endPoint: `/check-path-subscription-limit`,
      onSuccess: (res) => {
        console.log('Subscription response:', res?.data);
        if (res?.data?.Subscription_Status === false) {
          setCheckingPlanStatus(false);
        } else {
          // setCheckingPlanStatus(true);
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
      <main className="path-section" style={{ marginBottom: '25px' }}>
        <h2>Historical Prompts</h2>
        <UploadDataGrid heading={'Previous Entries'} dropdown={'October'} />
      </main>

      {checkingPlanStatus === false && <PaymentCheckout />}
    </React.Fragment>
  );
};

export default Path;

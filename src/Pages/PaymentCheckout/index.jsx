import React, { useEffect, useState } from 'react';
import { baseURL } from '../../Utils/contants';
import { Snackbar } from '../../Utils/SnackbarUtils';
import { GoNorthStar } from "react-icons/go";
import { loadStripe } from '@stripe/stripe-js';
import './index.scss';
import useFetch from 'point-fetch-react';

const PaymentCheckout = () => {
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);

    // stripe payment id 
    const stripePromise = loadStripe("pk_test_51R1N87D5HtmbtCzuDzCpymaMkkcPgWSY362IjaJ9vjX4NrscIgVy4Xf24nILCAKE2ftUfD6JvBIREg2iDoIXsmWD009wsUrL33");

    const { get } = useFetch({ state: {} })

    const getCheckoutPlans = () => {
        get({
            endPoint: `/get-subscription`,

            onSuccess: (res) => {
                setSubscriptionPlans(res?.data?.data || []);
            }
        });
    };

    const handlePlanSelection = async (planId) => {
        try {
            const response = await fetch(`${baseURL}/purchase-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('user-visited-dashboard')}`,
                },
                body: JSON.stringify({ subscriptionId: planId }),
            });
    
            const data = await response.json();
            console.log('Backend Response:', data); 
    
            if (data.status && data.data?.sessionId) {
                const stripe = await stripePromise;
                console.log('Session ID:', data.data.sessionId); 
    
                const result = await stripe.redirectToCheckout({ sessionId: data.data.sessionId });
    
                if (result.error) {
                    console.error('Stripe Redirect Error:', result.error); // Log Stripe redirect error
                    alert(result?.error?.message);
                }
            } else {
                console.error('Failed to create checkout session:', data); // Log failure to create session
                Snackbar('Failed to create checkout session', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error during checkout:', error); // Log any unexpected errors
            alert('Error occurred during checkout');
        }
    };


    useEffect(() => {
        getCheckoutPlans();
    }, []);

    return (
        <React.Fragment>
            <main className='path-section' style={{ marginTop: '40px' }}>

                <h4 style={{ textAlign: 'center', marginTop: '25px', marginBottom: '-10px', color: "var(--primary-btn-color)", fontSize:"1.7rem" }}>Choose Your Plan</h4>
                <div className="plans-container">
                    {subscriptionPlans?.map((plan) => (
                        <div key={plan?.id} className="plan-card">
                            <h3>{plan?.name}</h3>
                            <h2 style={{ color: "var(--primary-btn-color)", display:'flex', alignItems:'baseline' }}>
                            <h4 style={{fontSize:'1rem'}}>£</h4> 
                                {plan?.price} 
                            </h2>

                            <h5>{plan?.points}</h5>

                            <ul>
                                <li style={{ marginTop: '10px' }}>{plan?.description} </li>
                            </ul>

                            <button onClick={() => handlePlanSelection(plan?.id)}
                             style={{backgroundColor: '#eb814b'}}
                            >Proceed to Checkout</button>
                        </div>
                    ))}
                </div>
            </main>
        </React.Fragment>
    );
};

export default PaymentCheckout;

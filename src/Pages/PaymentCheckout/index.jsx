import React, { useEffect, useState } from 'react';
import Fire from '../../Fire/Fire';
import { baseURL } from '../../Fire/useFire';
import { Snackbar } from '../../Utils/SnackbarUtils';
import { GoNorthStar } from "react-icons/go";
import { loadStripe } from '@stripe/stripe-js';
import './index.scss';

const PaymentCheckout = () => {
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const stripePromise = loadStripe('pk_test_51PpmncIILuhliL1zY30SSomzkp2paejUduNmFduUkYhXjiblP0DeUGqf5QfOdH6FzKhruv2n50tWqxRG3QNBNmSg00EayNmN8a');

    const getCheckoutPlans = () => {
        Fire.get({
            url: `${baseURL}/get-subscription`,

            onSuccess: (res) => {
                setSubscriptionPlans(res?.data?.data || []);
                // Snackbar("Subscription Plans fetched successfully", { variant: 'success' });
            },

            onError: (err) => {
                console.log(err);
                Snackbar(err.error || "Subscription Plans fetch failed", { variant: "error" });
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
            Snackbar(data.message, { variant: 'success' });
            if (data.status && data.data?.sessionId) {
                const stripe = await stripePromise;
                const result = await stripe.redirectToCheckout({ sessionId: data.data.sessionId });

                if (result.error) {
                    alert(result?.error?.message);
                }
            } else {
                Snackbar('Failed to create checkout session', {variant:'error'});

            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred during checkout');
        } 
    };

    useEffect(() => {
        getCheckoutPlans();
    }, []);

    return (
        <React.Fragment>
            <main className='path-section'>
                <h2>Choose Your Subscription Plan</h2>

                <div className="plans-container">
                    {subscriptionPlans?.map((plan) => (
                        <div key={plan?.id} className="plan-card">
                            <h3>{plan?.name}</h3>
                            <h2>{plan?.price}$</h2>

                            <ul>
                                <li><GoNorthStar style={{ color: "rgb(61, 66, 223)" }} /> Lorem ipsum dolor sit.</li>
                                <li><GoNorthStar style={{ color: "rgb(61, 66, 223)" }} /> Lorem ipsum dolor sit.</li>
                                <li><GoNorthStar style={{ color: "rgb(61, 66, 223)" }} /> Lorem ipsum dolor sit.</li>
                            </ul>

                            <button onClick={() => handlePlanSelection(plan?.id)}>Proceed to Checkout</button>
                        </div>
                    ))}
                </div>
            </main>
        </React.Fragment>
    );
};

export default PaymentCheckout;

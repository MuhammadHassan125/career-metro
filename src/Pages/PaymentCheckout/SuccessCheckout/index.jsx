import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useFetch from 'point-fetch-react';
import Fire from '../../../Fire/Fire';
import { baseURL } from '../../../Utils/contants';

const Success = () => {
    const location = useLocation();

    const confirmSubscription = async (sessionId) => {
        const token = localStorage.getItem('user-visited-dashboard');
        if (!token) {
            alert('User not authenticated');
            return;
        }

        Fire.post({
            url: `${baseURL}/confirm-subscription`,
            data: { sessionId },
            headers: {
                Authorization: `Bearer ${token}`, 
            },
            onSuccess: (res) => {
                console.log('Subscription confirmed successfully:', res);
                alert("Subscription confirmed successfully");
            },
            onError: (err) => {
                console.error('Subscription confirmation error:', err);
                alert("Subscription confirmation failed");
            },
        });
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');

        if (sessionId) {
            confirmSubscription(sessionId);
        } else {
            console.log('Session ID is missing');
            alert('Session ID is missing');
        }
    }, [location.search]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        }}>
            <img src='/images/success.png' alt='success' style={{ width: "100px", height: "100px", marginBottom: "20px" }} />
            <h2 style={{ fontSize: "35px" }}>Thank You for Your Purchase!</h2>
            <p style={{ color: "#00d459" }}>Your subscription is being processed. You will receive a confirmation soon.</p>
        </div>
    );
};

export default Success;

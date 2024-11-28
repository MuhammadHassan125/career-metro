import React from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
import { Snackbar } from '../../../../Utils/SnackbarUtils'; // Adjust the path as needed

const GoogleBtn = () => {
  // const login = useGoogleLogin({
  //   onSuccess: async (codeResponse) => {
  //     try {
  //       const authorizationCode = codeResponse.code;

  //       const response = await fetch('http://192.168.18.194:8001/api/google-login', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ authorizationCode }),
  //       });

  //       const data = await response.json();

  //       if (response.ok && data.status) {
  //         // localStorage.setItem('jwtToken', data.data.token);
  //         localStorage.setItem('user-visited-dashboard', data.data.token); // Update localStorage here

  //         Snackbar('Google login successful.', { variant: 'success' });
  //         window.location.href = '/'; // Redirect to main page
  //       } else {
  //         Snackbar(`Google login failed: ${data.message || 'Unknown error'}`, { variant: 'error' });
  //       }
  //     } catch (error) {
  //       console.error('Google OAuth error:', error);
  //       Snackbar('Google login failed. Please try again.', { variant: 'error' });
  //     }
  //   },
  //   onError: (errorResponse) => {
  //     console.error('Google OAuth error:', errorResponse);
  //     Snackbar('Google login failed. Please try again.', { variant: 'error' });
  //   },
  //   flow: 'auth-code',
  // });

  return (
    <button
      // onClick={() => login()}
      style={{
        backgroundColor: 'white',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
      }}
    >
      <img width={'20px'} src='/images/google.png' alt='Google' />
    </button>
  );
};

export default GoogleBtn;

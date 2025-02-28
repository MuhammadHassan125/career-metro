import { useGoogleLogin } from '@react-oauth/google';
import { Snackbar } from '../../../../Utils/SnackbarUtils';
import { baseURL } from '../../../../Utils/contants';

const GoogleBtn = () => {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse.code, 'Authorization code received from Google');

      try {
        const response = await fetch(`${baseURL}/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorizationCode: codeResponse.code, 
          }),
        });

        if (response.ok) {
          const data = await response.json(); 
          console.log('Backend response:', data);
          
          if (data.data.token) {
            localStorage.setItem('user-visited-dashboard', data.data.token);
            console.log('Token saved to localStorage:', data.data.token);
          }

          window.location.reload();
        } else {
          // Handle backend errors
          const errorData = await response.json();
          console.error('Backend error:', errorData);
          Snackbar('Google login failed. Please try again.', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error during Google login:', error);
        Snackbar('Google login failed. Please try again.', { variant: 'error' });
      }
    },
    onError: (errorResponse) => {
      console.error('Google OAuth error:', errorResponse);
      Snackbar('Google login failed. Please try again.', { variant: 'error' });
    },
    flow: 'auth-code',
  });

  return (
    <button
      onClick={() => login()}
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
import React from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';

const FacebookBtn = () => {
  const responseFacebook = (response) => {

    if (response.status !== 'connected') {
      console.error('Login failed:', response.status);
      return;
    }

    const { accessToken } = response;
    // Example of sending the token to your backend directly
    fetch('http://192.168.18.194:8001/api/facebook-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken })
    })
      .then(response => response.json())
      .then(data => {
      })
  };

  return (
    <FacebookLogin
      appId="3646152678982030"
      autoLoad={false}
      callback={responseFacebook}
      render={(renderProps) => (
        <button onClick={renderProps.onClick} className='social-icon-div' style={{ backgroundColor: 'white', border: 'none', outline: 'none' }}>
          <img width={'20px'} src='/images/facebook.png' alt='facebook' />
        </button>
      )}
    />
  );
};

export default FacebookBtn;

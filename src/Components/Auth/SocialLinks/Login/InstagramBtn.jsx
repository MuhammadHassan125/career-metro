import React from 'react';
import { baseURL } from '../../../../Utils/contants';
import Fire from '../../../../Fire/Fire';
const InstagramBtn = () => {
  const clientId = '1010450964112254';
  const redirectUri = encodeURIComponent('https://localhost:5173/login');

  // const handleLogin = () => {
  //   const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;

  //   const width = 600;
  //   const height = 700;
  //   const left = (window.innerWidth - width) / 2;
  //   const top = (window.innerHeight - height) / 2;

  //   const popup = window.open(instagramAuthUrl, '_self');

  //   const interval = setInterval(() => {
  //     if (popup.closed) {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  // };

  const handleLogin = () => {
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;

    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(instagramAuthUrl, '_blank', `width=${width},height=${height},left=${left},top=${top}`);

    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);

        const url = popup.document.URL;
        const codeRegex = /code=([^&]+)/;
        const match = url.match(codeRegex);
        if (match) {
          const code = match[1];

          const accessToken = code;

          Fire.post({
            url: `${baseURL}/instagram-login`,
            data: { accessToken },

            onSuccess: (res) => {
              Snackbar(res.data.message, { variant: 'success' });
            },

            onError: (err) => {
              Snackbar('Instagram login failed. Please try again.', { variant: 'error' });
            }
          })
        }
      }
    }, 1000);
  };
  return (
    <div
      onClick={handleLogin}
      style={{
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      <img width={'20px'} src='/images/instagram.png' alt="Instagram Logo" />
    </div>
  );
};

export default InstagramBtn;

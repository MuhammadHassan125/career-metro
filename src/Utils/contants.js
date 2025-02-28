// local ip
export const baseURL = "http://localhost:8001/api";
// export const AnalyzeURL = "http://87.106.188.142:80/ai";

// server ip
// export const baseURL = "https://app.mycareermap.ai/api";
export const AnalyzeURL = "https://app.mycareermap.ai/ai";

export const token = localStorage.getItem("user-visited-dashboard");

export const GoogleClientId =
  "744833461193-lesf2blo0a5dbmb2e9iq39r4a3feqd2c.apps.googleusercontent.com";

export const LinkedinClientId = "77xgzu666vbrij";

// try {
//   const authorizationCode = codeResponse.code;

//   const response = await fetch(`${baseURL}/google-login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ authorizationCode }),
//   });

//   const data = await response.json();

//   if (response.ok && data.status) {
//     localStorage.setItem('user-visited-dashboard', data.data.token);

//     Snackbar('Google login successful.', { variant: 'success' });
//     window.location.href = '/';
//   } else {
//     Snackbar(`Google login failed: ${data.message || 'Unknown error'}`, { variant: 'error' });
//   }
// } catch (error) {
//   console.error('Google OAuth error:', error);
//   Snackbar('Google login failed. Please try again.', { variant: 'error' });
// }

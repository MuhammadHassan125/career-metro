import React from 'react';
import PrimaryInput from '../../../Components/PrimaryInput';
import { useNavigate } from 'react-router-dom';
import useFetch from 'point-fetch-react';
import Loading from '../../../Components/Loading';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { Data, setData, errors, put, Processing } = useFetch({
    state: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    put({
      endPoint: `/change-profile-password`,

      onSuccess: (res) => {
        if (res.data.data.AuthToken || res.data.status === true) {
          localStorage.setItem('user-visited-dashboard', res.data.data.AuthToken);
          alert(res.data.message);
          navigate('/');
        } else {
          alert(errors || "Login Failed");
        }
      },
      onError: (err) => {
        alert(err.error);
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  return (
    <>
      {Processing ? <Loading fullScreen={false} processing={Processing} /> : null}
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="login-form">
          <form onSubmit={handleLogin}>
            <div className="login-form-heading">
              <img src="/images/logo.png" alt="logo" className="login-logo" />
              <h2>Change your password</h2>
              <p>Please enter your email and password to continue</p>
            </div>

            <div className="email-div">
              <p>Current Password:</p>
              <PrimaryInput
                type="password"
                placeholder="Current password"
                name="currentPassword"
                value={Data.currentPassword}
                onChange={handleInputChange}
              />
              {/* {errors.email && <p className="error">{errors.email}</p>} */}
            </div>

            <div className="email-div">
              <div>
                <p>New Password:</p>
              </div>
              <PrimaryInput
                type="password"
                placeholder="New Password"
                name="newPassword"
                value={Data.newPassword}
                onChange={handleInputChange}
              />
              {/* {errors.password && <p className="error">{errors.password}</p>} */}
            </div>

            <div className="email-div">
              <div>
                <p>Confirm Password:</p>
              </div>
              <PrimaryInput
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={Data.confirmPassword}
                onChange={handleInputChange}
              />
              {/* {errors.password && <p className="error">{errors.password}</p>} */}
            </div>

            <div style={{ width: '100%' }}>
              {/* <PrimaryBtn text="Login" /> */}
              <button
                type="submit"
                style={{
                  width: '100%', borderRadius: '10px', backgroundColor: '#879aad', border: 'none',
                  padding: '10px 20px', color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer', hover: { opacity: '0.9' }
                }}
              >Change Password</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ChangePassword;

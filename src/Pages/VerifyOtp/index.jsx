import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '../../Utils/SnackbarUtils';
import { MuiOtpInput } from 'mui-one-time-password-input';
import FormBtn from '../../Components/Auth/FormBtn';
import Form from '../../Components/Auth/Form'
import useFetch from 'point-fetch-react';

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [timer, setTimer] = useState(600);
  const [showResend, setShowResend] = useState(false);
  const { Data, setData, post, processing } = useFetch({
    state: {
      otp: ''
    },
    rules: {
      otp: ['required']
    },
    message: {
      otp: {
        required: 'Please provide OTP is required'
      }
    }
  });

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    } else {
      setShowResend(true);
    }
  }, [timer]);

  const handleChange = (value) => {
    setData('otp', value);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    post({
      endPoint: `/verify-otp`,

      onSuccess: (res) => {
        alert(res.data.message);
        localStorage.setItem('reset-token', true)
        navigate('/reset-password');
      }
    });
  };


  const handleResendOtp = () => {
    Snackbar("Resent your OTP", { variant: 'warning' });
    setTimer(60);
    setShowResend(false);
    navigate('/forget-password')
  };

  return (
    <>
      <Form onSubmit={handleSubmit} >
        <div style={{ padding: '30px 0' }}>
          <div className="login-form-heading">
            <h2>Verify OTP</h2>
            <p>Verify your OTP to reset your password</p>
          </div>

          <div className="register-fields-div" style={{ marginBottom: '20px' }}>
            <p>Enter OTP:</p>
            <MuiOtpInput value={Data.otp} onChange={handleChange} length={6} />
          </div>

          <FormBtn text={"Verify OTP"} processing={processing} />

          {showResend ? (
            <div className="login-account">
              <p>Didn't receive an OTP?
                <span className='link-class' onClick={handleResendOtp}> Resend OTP</span>
              </p>
            </div>
          ) : (
            <div className="login-account">
              <p>OTP will expire in: <span>{timer} seconds</span></p>

            </div>

          )}
        </div>
      </Form>
    </>
  );
};

export default VerifyOtp;

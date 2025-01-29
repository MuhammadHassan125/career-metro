import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "../../Utils/SnackbarUtils";
import { MuiOtpInput } from "mui-one-time-password-input";
import FormBtn from "../../Components/Auth/FormBtn";
import Form from "../../Components/Auth/Form";
import useFetch from "point-fetch-react";
import "../Login/index.scss";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);

  const { Data, setData, post, processing } = useFetch({
    state: {
      otp: "",
    },
    rules: {
      otp: ["required"],
    },
    message: {
      otp: {
        required: "Please provide OTP is required",
      },
    },
  });

  useEffect(() => {
    let intervalId;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setShowResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (value) => {
    setData("otp", value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    post({
      endPoint: `/verify-otp`,
      onSuccess: (res) => {
        alert(res.data.message);
        localStorage.setItem("reset-token", true);
        navigate("/reset-password");
      },
    });
  };

  const handleResendOtp = () => {
    Snackbar("Resent your OTP", { variant: "error" });
    setTimer(60);
    setShowResend(false);
    navigate("/forget-password");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div style={{ padding: "20px 0" }}>
        <div className="login-form-heading">
          <h2>Verify OTP</h2>
          <p>Verify your OTP to reset your password</p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "25px",
            marginTop: "20px",
          }}
        >
          <div className="register-fields-div">
            <p style={{ marginBottom: "12px" }}>Enter OTP:</p>
            <MuiOtpInput
              value={Data.otp}
              onChange={handleChange}
              length={6}
              sx={{
                "& input": {
                  fontSize: "20px",
                  color: "black",
                  textAlign: "center",
                  padding: "10px",
                  "@media (max-width: 600px)": {
                    fontSize: "15px", // Mobile per aur bara text
                    padding: "12px",
                  },
                },
              }}
            />
          </div>

          <FormBtn text="Verify OTP" processing={processing} />

          {showResend ? (
            <div className="create-account">
              <p>
                Didn&apos;t receive an OTP?
                <span
                  className="link-class cursor-pointer "
                  onClick={handleResendOtp}
                >
                  {" "}
                  Resend OTP
                </span>
              </p>
            </div>
          ) : (
            <div className="login-account" style={{ textAlign: "center" }}>
              <p>
                Otp will expire in: <span>{formatTime(timer)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export default VerifyOtp;

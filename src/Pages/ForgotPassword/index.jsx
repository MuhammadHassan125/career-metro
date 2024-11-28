import PrimaryInput from '../../Components/PrimaryInput';
import { Link, useNavigate } from 'react-router-dom';
import Form from '../../Components/Auth/Form';
import FormBtn from '../../Components/Auth/FormBtn';
import useFetch from 'point-fetch-react';

const ForgotPassword = () => {

  const navigate = useNavigate();
  const { Data, setData, post, Errors, processing, validate } = useFetch({
    state: {
      email: '',
    },
    rules: {
      email: ['required', 'email']
    }
  });

  const handleSubmit = () => {
    if (validate()) {
      post({
        endPoint: `/request-for-otp`,
        onSuccess: (res) => {
          if (res?.data?.status === true) {
            localStorage.setItem('otp-verified', true);
            navigate('/verify-otp');
          } return
        }
      });

    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  }

  return (
    <>
      <Form onSubmit={handleSubmit} processing={processing}>
        <div style={{ padding: '30px 0' }}>
          <div className="login-form-heading">
            <h2>Forget Password</h2>
            <p>Get OTP to reset your password</p>
          </div>

          {/* email  */}
          <div className="register-fields-div" style={{ marginBottom: '20px' }}>
            <p>Email address:</p>
            <PrimaryInput
              type="email"
              placeholder="Enter Email"
              name="email"
              value={Data.email}
              onChange={handleInputChange}
            />
            {Errors.email && <p className="error">{Errors.email}</p>}
          </div>

          <FormBtn processing={processing} text={'GET OTP'} />

          <div className='login-account'>
            <p>Dont wont to forget password
              <Link to="/login" className='link-class'>
                <span> Login</span>
              </Link>
            </p>
          </div>
        </div>
      </Form>
    </>
  )
}

export default ForgotPassword
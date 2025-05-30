import PrimaryInput from '../../Components/PrimaryInput';
import { Link, useNavigate } from 'react-router-dom';
import { Snackbar } from '../../Utils/SnackbarUtils';
import Form from '../../Components/Auth/Form';
import FormBtn from '../../Components/Auth/FormBtn';
import useFetch from 'point-fetch-react';
const ResetPassword = () => {
  const navigate = useNavigate();

  const { Data, setData, post, Errors, Processing, validate } = useFetch({
    state: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },

    rules: {
      email: ['required', 'email'],
      newPassword: ['same:newPassword'],
      confirmPassword: ['same:newPassword'],
    },


  });


  const handleSubmit = () => {
    if (validate()) {
      post({
        endPoint: '/reset-password',
        onSuccess: (res) => {
          navigate('/login');
        },

        onError: (err) => {
          Snackbar(err.error, { variant: 'error' });
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
      <div style={{ padding: '30px 0', }}>
        <Form onSubmit={handleSubmit} processing={Processing}
        >

          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <div className="login-form-heading">
            <h2>Reset Password</h2>
            <p>Reset password your forget password</p>
          </div>

          <div className="register-fields-div">
            <p style={{ marginBottom: '5px', fontSize: '14px' }}>Email:</p>
            <PrimaryInput
              type="email"
              placeholder="Enter Email"
              name="email"
              value={Data.email}
              onChange={handleInputChange}
            />
            {Errors.email && <p className="error">{Errors.email}</p>}
          </div>

          {/* new Password  */}
          <div className="register-fields-div">
            <p style={{ marginBottom: '5px', fontSize: '14px' }}>New Password:</p>
            <PrimaryInput
              type="password"
              placeholder="Enter Email"
              name="newPassword"
              value={Data.newPassword}
              onChange={handleInputChange}
            />
            {Errors.password && <p className="error">{Errors.password}</p>}
          </div>

          {/* confirm password  */}
          <div className="register-fields-div" style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '5px', fontSize: '14px' }}>Confirm Password:</p>
            <PrimaryInput
              type="password"
              placeholder="Enter Email"
              name="confirmPassword"
              value={Data.confirmPassword}
              onChange={handleInputChange}
            />
            {Errors.password && <p className="error">{Errors.password}</p>}
          </div>
          </div>

          <FormBtn text={"Reset Password"} processing={Processing} />

          <div className='create-account' style={{ marginTop: '10px', textAlign: 'center', fontSize: '14px' }}>
            <p>Don&apos;t won&apos;t to reset your password
              <Link to="/login" className='link-class'>
                <span> Login</span>
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </>
  )
}

export default ResetPassword
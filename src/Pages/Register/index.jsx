import './index.scss'
import PrimaryInput from '../../Components/PrimaryInput';
import { Link, useNavigate } from 'react-router-dom';
import Form from '../../Components/Auth/Form';
import FormBtn from '../../Components/Auth/FormBtn';
import SocialLinkComponent from '../../Components/Auth/SocialLinks/SocialLinksComponent';
import useFetch from 'point-fetch-react';

const Register = () => {

  const navigate = useNavigate();
  const { Data, setData, post, Errors, Processing, validate } = useFetch({
    state: {
      email: '',
      username: '',
      password: ''
    },

    rules: {
      email: ['required', 'email'],
      username: ['required', 'username'],
      password: ['required', 'min:8', 'regex:/^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$/'] // For minimum 8 chars with one letter and one number
    },
    message: {
      username: {
        required: 'username field must be unique'
      },
      password: {
        required: 'Password must be at least 8 characters long, contain at least one letter and one number'
      }
    }
  });

  const handleSubmit = () => {
    if (validate()) {
      post({
        endPoint: `/register`,
        onSuccess: (res) => {
          navigate('/login');
        },
        onError: (error) => {
          alert(error.message || 'Registration failed', { variant: 'error' });
        },
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };


  return (
    <div style={{padding:'20px 0'}}>
      <Form onSubmit={handleSubmit} processing={Processing}>

        <div className="login-form-heading">
          <h2>Create an Account</h2>
          <p>Sign up with your social media account or email address</p>
        </div>

        {/* social media icons  */}
        <SocialLinkComponent />

        <div className="or-div">
          <img src='/images/line.png' />
          <span>or</span>
          <img src='/images/line.png' />
        </div>


        {/* email  field*/}
        <div className="register-fields-div">
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

        {/* username  field*/}
        <div className="register-fields-div">
          <p>Username:</p>
          <PrimaryInput
            type="text"
            placeholder="Enter Username"
            name="username"
            value={Data.username}
            onChange={handleInputChange}
          />
          {Errors.username && <p className="error">{Errors.username}</p>}
        </div>

        {/* password  field*/}
        <div className="register-fields-div">
          <div>
            <p>Password:</p>
            <Link className='link-class' to='/forget-password'>
              <span>Forget Password?</span>
            </Link>
          </div>
          <PrimaryInput
            type="password"
            placeholder="Password"
            name="password"
            value={Data.password}
            onChange={handleInputChange}
          />
          {Errors.password && <p className="error">{Errors.password}</p>}
        </div>

        {/* Remember Password */}
        <div className="remember-flex">
          <input type="checkbox" />
          <span>I accept terms and conditions</span>
        </div>

        <FormBtn processing={Processing} text={"Sign Up"} />

        <div className='login-account'>
          <p>Already have an account?
            <Link to="/login" className='link-class'>
              <span> Login</span>
            </Link>
          </p>
        </div>

      </Form>
    </div>
  )
}

export default Register
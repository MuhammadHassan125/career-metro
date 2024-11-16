import './index.scss';
import PrimaryInput from '../../Components/PrimaryInput';
import { Link, useNavigate } from 'react-router-dom';
import Form from '../../Components/Auth/Form';
import SocialLinkComponent from '../../Components/Auth/SocialLinks/SocialLinksComponent';
import FormBtn from '../../Components/Auth/FormBtn';
import useFetch from 'point-fetch-react';

const Login = () => {
  const navigate = useNavigate();

  const { Data, setData, Errors, post, Processing, validate } = useFetch({
    state:{
      email: '', 
      password: '' 
    },
    rules:{
      email: ['required','email'],
      password: ['required']
    },
    message:{
      email:{
        required: 'Email is required',
      }
    }
  });

  const handleLogin = () => {
    if(validate()){
      post({
        endPoint:'/login',
        onSuccess: (res) => {
          const token = res.data.data.AuthToken;
          localStorage.setItem('user-visited-dashboard', token);

          const userRole = res.data.data.roleName;
          localStorage.setItem('user-role', userRole);
          
          const permissionSlugs = res?.data?.data?.permissionSlugs;
          localStorage.setItem("userPermissions", JSON.stringify(permissionSlugs));

          navigate('/');
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };


  return (
    <>
          <Form onSubmit={handleLogin} processing={Processing}>
            <div className="login-form-heading">
              <img src="/images/logo.png" alt="logo" className="login-logo" />
              <h2>Login to Account</h2>
              <p>Please enter your email and password to continue</p>
            </div>

            <div className="email-div">
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

            <div className="email-div">
              <div>
                <p>Password:</p>
                <Link className='link-class' to="/forget-password"><span>Forget Password?</span></Link>
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

            <div className="remember-flex">
              <input type="checkbox" />
              <span>Remember Password</span>
            </div>

            <FormBtn text={"Login"} processing={Processing}/>
          </Form>

          <div className="or-div">
            <img src='/images/line.png' />
            <span>or</span>
            <img src='/images/line.png' />
          </div>

          {/* {/* here I am moving the social login buttons outside the form */}
          <SocialLinkComponent/>

          <div className='create-account'>
            <p>Dont have an account?
              <Link className='link-class' to="/register">
                <span>Create Account</span>
              </Link>
            </p>
          </div>
    </>
  );
};

export default Login;

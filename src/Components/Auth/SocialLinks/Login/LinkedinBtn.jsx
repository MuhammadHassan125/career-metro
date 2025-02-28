
import { baseURL, LinkedinClientId } from "../../../../Utils/contants";
import { FaLinkedin } from "react-icons/fa";

const LinkedinBtn = () => {
  const handleLogin = () => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: LinkedinClientId,
      redirect_uri: `${baseURL}/linkedin-login`,
      scope: "openid email profile",
    });

    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  };

  return (
    <div onClick={handleLogin} style={{fontSize:'1.3rem', color:'#007ab5'}}>
      <FaLinkedin />
    </div>
  );
};

export default LinkedinBtn;

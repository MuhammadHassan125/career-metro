import React from "react";
import GoogleBtn from "./Login/GoogleBtn";
import LinkedinBtn from "./Login/LinkedinBtn";
import '../../../Pages/Register/index.scss';
const SocialLinkComponent = () => {
    const SocialComponents = [
      { btn: [<GoogleBtn />, <LinkedinBtn /> ] },
    ];
  
    return (
      <React.Fragment>
      <div>
        {SocialComponents.map((item, key) => {
          return (
            <div className='signup-social-icons' style={{display:'flex', justifyContent:'space-between', padding:'15px 0'}} key={key}>
              {item.btn.map((Component, i) => (
                <div className='social-icons-div'
                  style={{
                    border: "#E8E8E8 1px solid",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '8px',
                  }}
                key={i}>
                  {Component}
                </div>
              ))}
            </div>
          );
        })}
      </div>
        </React.Fragment>
    );
  };
  
  export default SocialLinkComponent;
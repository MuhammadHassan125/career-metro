import React from "react";
import FacebookBtn from "./Login/FacebookBtn";
import GoogleBtn from "./Login/GoogleBtn";
import InstagramBtn from "./Login/InstagramBtn";
import LinkedinBtn from "./Login/LinkedinBtn";
import OutlookBtn from "./Login/OutlookBtn";

const SocialLinkComponent = () => {
    const SocialComponents = [
      { btn: [<OutlookBtn />, <LinkedinBtn />, <FacebookBtn />, <GoogleBtn />, <InstagramBtn />] },
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
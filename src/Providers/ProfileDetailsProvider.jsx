import React, { useEffect, useState } from "react";
import Fire from "../Fire/Fire";
import { baseURL } from "../Utils/contants";
import ProfileDetailsContext from "../context/ProfileDetailContext";

const ProfileDetailsProvider = ({ children }) => {
    const [user, setUser] = React.useState();

    const gettingProfileInfo = () => {
        Fire.get({
          url: `${baseURL}/show-profile`,
          onSuccess: (res) => {
            setUser(res.data);
          },
          onError: (err) => {
            console.log(err);
            Snackbar(err.message, { variant: 'error' });
          },
        });
      };
    
    useEffect(() => {
            gettingProfileInfo();
    }, []);

    return(
        <ProfileDetailsContext.Provider value={{ user, setUser, gettingProfileInfo }}>
            {children}
        </ProfileDetailsContext.Provider>
    );
}

export default ProfileDetailsProvider;
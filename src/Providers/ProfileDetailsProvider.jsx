import React from "react";
import Fire from "../Fire/Fire";
import { baseURL } from "../Utils/contants";
import ProfileDetailsContext from "../context/ProfileDetailContext";

const ProfileDetailsProvider = ({ children }) => {

    const [user, setUser] = React.useState();

    const authToken = localStorage.getItem("user-visited-dashboard")
    const gettingProfileInfo = () => {
        if (!authToken) return;
        Fire.get({
            url: `${baseURL}/show-profile`,
            onSuccess: (res) => {
                setUser(res?.data || []);
            },
            onError: (err) => {
                setUser([]);
            },
        });
    };

    React.useEffect(() => {
        gettingProfileInfo();
    }, []);
    
    return(
        <ProfileDetailsContext.Provider value={{user, setUser, gettingProfileInfo}}>
            {children}
        </ProfileDetailsContext.Provider>
    )
}

export default ProfileDetailsProvider
import React, { useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import MapProvider from "./MapProvider";
import Fire from "../Fire/Fire";
import { baseURL } from "../Utils/contants";

const UserProvider = ({ children }) => {

  const [user, setUser] = useState();
  const authToken = localStorage.getItem("user-visited-dashboard");

  const gettingProfileInfo = () => {
    if (!authToken) return;
    Fire.get({
      url: `${baseURL}/show-profile`,
      onSuccess: (res) => {
        setUser(res?.data || []);
        console.log("data", res);
      },
      onError: (err) => {
        console.log(err);
        setUser([]);
      },
    });
  };

  useEffect(() => {
    if (authToken) {
      gettingProfileInfo();
    }
  }, [authToken]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        gettingProfileInfo
      }}
    >
      <MapProvider>{children}</MapProvider>
    </UserContext.Provider>
  );
};

export default UserProvider;

import { Provider } from "point-fetch-react";
import React from "react";
import { Outlet } from "react-router-dom";
import { baseURL } from "../Utils/contants";
import useErrorDialogs from "../Hooks/useErrorDialogs";

const LayoutWrapper = ({ children }) => {
  const { handleOpenUnAuthorizeModal, handleOpenInternalServer } =
    useErrorDialogs();
  return (
    <Provider
      baseURL={baseURL}
      authorization={`Bearer ${localStorage.getItem("user-visited-dashboard")}`}
      onUnAuthenticated={handleOpenUnAuthorizeModal}
      onServerError={handleOpenInternalServer}
    >
      {children}
    </Provider>
  );
};

export default LayoutWrapper;

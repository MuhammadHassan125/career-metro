import { Provider } from "point-fetch-react";
import React, { Suspense } from "react";
import { baseURL } from "../Utils/contants";
import useErrorDialogs from "../Hooks/useErrorDialogs";
import GuestLoading from "../Components/GuestRoutesLoading";

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
      <Suspense fallback={<GuestLoading />}>{children}</Suspense>
    </Provider>
  );
};

export default LayoutWrapper;

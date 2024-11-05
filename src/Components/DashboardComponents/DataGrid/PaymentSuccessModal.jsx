import React from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const PaymentSuccessModal = () => {

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            backgroundColor: "#fff",
            padding: "30px 60px",
            borderRadius: "10px",
          }}
        >
          <IoIosCheckmarkCircleOutline
            style={{ fontSize: "6rem", color: "var(--primary-btn-color)" }}
          />

          <h2 style={{ fontSize: "30px", marginBottom: "10px" }}>
            Thank You for Your Purchase!
          </h2>
          
          <p style={{color: "var(--primary-btn-color)", textAlign:'center'}}>
          you will receive your training plan by email <br/>within 2 working days
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PaymentSuccessModal;




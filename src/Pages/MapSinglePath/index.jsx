import React, { useEffect, useState, useContext } from "react";
import { BiExport } from "react-icons/bi";
import SinglePathMap from "./SinglePathMap";
import AddPathComponent from "../../Components/AddPathComponent";
import GPTComponent from "../../Components/DashboardComponents/DataGrid/GptComponent";
import "./index.scss";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MapContext from "../../context/MapContext";
import useFetch from "point-fetch-react";

const MapSinglePath = () => {
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const { getTitle } = useContext(MapContext);
  const params = useParams();

  const { post, Data, setData, Errors, processing } = useFetch({
    state: {
      branchId: params.id || "", 
    },
  });

  useEffect(() => {
    setData("branchId", params.id);
  }, [params.id, setData]);

  const handleIdFromChild = (id) => {
    setSelectedPathId(id);
  };

  const handleNavigate = () => {
    window.open(`/get-pdf/${params.id}`, "_blank");
  };

  const redirectToStripe = () => {
    if (!Data.branchId) {
      alert("Branch ID is not available");
      return;
    }

    post({
      endPoint: `/redirect-subscription`,
      data: { branchId: Data.branchId }, 
      onSuccess: (res) => {
        setCheckoutUrl(res?.data?.data?.url);
        setOpen(true);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <React.Fragment>
      <main className="map-section">
        {/* heading div  */}
        <div className="main__heading">
          <div>
            <h2>Individual Path</h2>
          </div>
          <div className="map-section__btn-div">
            <p>
              <strong>{getTitle} </strong>/ 19 Paths
            </p>
            <button className="map-section__btn" onClick={redirectToStripe} disabled={processing}>
              <BiExport style={{ fontSize: "18px" }} />
              Export your Training PDF
            </button>
            <AddPathComponent />
          </div>
        </div>

        <div className="map-section__map-div">
          <SinglePathMap onSelectId={handleIdFromChild} />
        </div>

        <GPTComponent selectedPathId={selectedPathId} />
      </main>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "var(--primary-btn-color)" }}>
          Proceed to Checkout
        </DialogTitle>
        <DialogContent>
          <p>
            You will be redirected to Stripe to complete your payment. Do you
            want to continue?
          </p>
        </DialogContent>
        <DialogActions sx={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              color: "var(--primary-btn-color)",
              fontSize: "13px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              window.open(checkoutUrl, "_blank");
              setOpen(false);
            }}
            style={{
              backgroundColor: "var(--primary-btn-color)",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              outline: "none",
              padding: "10px 20px",
            }}
          >
            Yes, Proceed
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default MapSinglePath;

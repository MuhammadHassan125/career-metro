import React, { useEffect, useState, useContext } from "react";
import { BiExport } from "react-icons/bi";
import SinglePathMap from "./SinglePathMap";
import AddPathFromSinglePath from "../../Components/AddPathFromSinglePath";
import GPTComponent from "../../Components/DashboardComponents/DataGrid/GptComponent";
import "./index.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MapContext from "../../context/MapContext";
import useFetch from "point-fetch-react";
import PrimaryBtn from "../../Components/PrimaryBtn";

const MapSinglePath = () => {
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const [trainingExceed, setTrainingExceed] = useState(false);
  const { getTitle } = useContext(MapContext);

  const params = useParams();
  const navigate = useNavigate();
  const { checkingPlanStatus, setCheckingPlanStatus } = useContext(MapContext);

  const { post, get, Data, setData, Errors, processing } = useFetch({
    state: {
      branchId: params.id || "",
    },
  });

  useEffect(() => {
    if (params.id && Data.branchId !== params.id) {
      setData("branchId", params.id);
    }
  }, [params.id, Data.branchId, setData]);

  const handleIdFromChild = (id) => {
    setSelectedPathId(id);
  };

  const handleNavigate = () => {
    setTrainingExceed(false);
    navigate("/path");
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
    });
  };

  const checkTrainingPlanSubscription = () => {
    get({
      endPoint: `/check-training-plan-subscription-limit`,

      onSuccess: (res) => {
        if (res?.data?.TrainingPlan_Status === false) {
          setCheckingPlanStatus(false);
          setTrainingExceed(true);
        } else {
          console.log('export pdf ')
          navigate(`/get-pdf/${params.id}`);
        }
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
              <strong>{getTitle} </strong>
            </p>
            <button
              className="map-section__btn"
              onClick={checkTrainingPlanSubscription}
              disabled={processing}
              style={{ backgroundColor: "#eb814b", color: "white" }}
            >
              <BiExport style={{ fontSize: "18px" }} />
              Export your Training PDF
            </button>
            <AddPathFromSinglePath />
          </div>
        </div>

        <div className="map-section__map-div">
          <SinglePathMap
            onSelectId={handleIdFromChild}
            onEditTitle={(node) => {
              // Handle editing the title here
              console.log("Edit title for node:", node);
            }}
          />
        </div>

        <GPTComponent selectedPathId={selectedPathId} />
      </main>

      {/* proceed to training plan  */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "var(--primary-btn-color)" }}>
          Proceed to Checkout for generate plan
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
              padding: "10px 15px",
              borderRadius: "10px",
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

      {/* will show the training exceed  */}
      <Dialog
        open={trainingExceed}
        onClose={() => setTrainingExceed(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "var(--primary-btn-color)" }}>
          Limit Exceed
        </DialogTitle>
        <DialogContent>
          <p>
            {/* Your Training Plan Limit has been exceeded. */}
            You have used all your training plans. Buy another one to continue.
          </p>
        </DialogContent>
        <DialogActions sx={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => setTrainingExceed(false)}
            style={{
              color: "var(--primary-btn-color)",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              padding: "10px 15px",
              borderRadius: "8px",
            }}
          >
            Cancel
          </button>

          <PrimaryBtn text={"Purchase Plan"} onClick={handleNavigate} />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default MapSinglePath;

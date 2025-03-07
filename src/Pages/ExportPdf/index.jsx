import { useEffect, useState } from "react";
import {baseURL, AnalyzeURL} from '../../Utils/contants';
import "./index.scss";
import Fire from "../../Fire/Fire";
import { useParams, useLocation } from "react-router-dom";
import { Snackbar } from "../../Utils/SnackbarUtils";
import PaymentSuccessModal from "../../Components/DashboardComponents/DataGrid/PaymentSuccessModal";
import Loading from "../../Components/Loading";
const ExportPdf = () => {
  const [branchId, setBranchId] = useState(null);
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [generate, setGenerate] = useState(false);

  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    setBranchId(params.id);
  }, [params.id]);

  useEffect(() => {
    // const queryParams = new URLSearchParams(location.search);
    // const sessionParam = queryParams.get("session_id");

    // setSessionId(sessionParam);

    // // Only set open to true if session_id is not present
    // if (!sessionParam) {
    //   setOpen(true);
    // } else {
    //   setOpen(false);
    // }
    setOpen(true)
  }, []);

  const confirmSubscription = () => {
    Fire.post({
      url: `${baseURL}/confirm-model-subscription`,
      data: {
        sessionId,
        branchId,
      },
      onSuccess: (res) => {
        setOpen(false);
      },
      onError: (err) => {
        Snackbar(err.message, { variant: "error" });
      },
    });
  };

  const generateTrainingSteps = () => {
    Fire.post({
      url: `${AnalyzeURL}/generate_training_steps?branch_id=${branchId}`,
      onSuccess: (res) => {
        setGenerate(true);
        Snackbar("Training steps generation has started", {
          variant: "success",
          style: { backgroundColor: 'var(--primary-btn-color)' }
        });
      }
    });
  };

  // calling confirm subscription api
  useEffect(() => {
    if (branchId) {
      setOpen(false);
      generateTrainingSteps();
    }
  }, [branchId]);

  return (
    <div style={{ backgroundColor: '#f5f6fa', display: 'flex', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
      {generate === true ?
        <PaymentSuccessModal />
        : <Loading processing={true} />
      }

    </div>
  );
};

export default ExportPdf;

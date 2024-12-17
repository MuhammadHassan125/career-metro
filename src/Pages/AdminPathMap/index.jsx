import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../Components/Loading";
import { Card, CardContent, Typography, Box } from "@mui/material";
import useFetch from "point-fetch-react";
import DrawBranch from "../../Utils/DrawBranch";
import { Snackbar } from "../../Utils/SnackbarUtils";

const AdminPathMap = () => {
  const [pathDetailsArray, setPathDetailsArray] = React.useState([]);
  const [pathInfo, setPathInfo] = React.useState({});
  const navigate = useNavigate();
  const svgRefs = useRef([]);
  const { get, Processing } = useFetch({ state: {} });
  const { id } = useParams();

  const getMapDetails = () => {
    get({
      endPoint: `/get-single-path-detail/${id}`,
      onSuccess: (res) => {
        Snackbar(res.data.message, {
          variant: "success",
          style: { backgroundColor: "var(--primary-btn-color)" },
        });
        const pathData = res.data.data[0];
        setPathInfo({
          username: pathData?.Username,
          title: pathData?.Title,
          status: pathData?.Status,
          prompt: pathData?.Prompt,
        });
        setPathDetailsArray(res.data.data || []);
      }
    });
  };

  useEffect(() => {
    getMapDetails();
  }, []);

  useEffect(() => {
    if (pathDetailsArray.length > 0 && pathInfo.status === "analysed") {
      const width = 1000;
      const height = 600;

      for (let index = 0; index < pathDetailsArray.length; index++) {
        const branch = pathDetailsArray[index].branch;
        const svg = d3
          .select(svgRefs.current[index])
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        DrawBranch(svg, branch, width, height, navigate);
      }
    }
  }, [pathDetailsArray, navigate, pathInfo.status]);

  // Render pending status UI
  const renderPendingUI = () => (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0'
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#333', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}
      >
        User Path is Pending
      </Typography>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          color: '#666', 
          maxWidth: '500px',
          marginBottom: '20px'
        }}
      >
        The path for this user is currently being processed. 
        Please check back later for the complete analysis.
      </Typography>
      {/* <img 
        src="/waiting-illustration.svg" 
        alt="Pending Analysis" 
        style={{ 
          maxWidth: '300px', 
          marginTop: '20px' 
        }}
      /> */}
    </Box>
  );

  return (
    <>
      {Processing ? <Loading processing={Processing} /> : null}
      
      {pathInfo.status === "pending" ? (
        renderPendingUI()
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "20px",
            minHeight: "calc(100vh - 100px)",
            justifyContent: "center",
          }}
        >
          {/* Path Info Card */}
          {pathInfo.title && (
            <Card
              sx={{
                maxWidth: "100%",
                marginBottom: "5px",
                padding: "5px 20px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                backgroundColor: "#f9f9f9",
                fontFamily: "Poppins, sans-serif",
                borderRadius: "30px",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <span style={{ fontWeight: "bold" }}>Username:</span> {pathInfo.username}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <span style={{ fontWeight: "bold" }}>Title:</span> {pathInfo.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: pathInfo.status === "analysed" ? "#1976d2" : null,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Status:</span> {pathInfo.status}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: "5px" }}>
                  <span style={{ fontWeight: "bold" }}>Prompt:</span> {pathInfo.prompt}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Path Map */}
          {pathDetailsArray.length > 0 && pathInfo.status === "analysed" ? (
            pathDetailsArray.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  width: "100%",
                  height: "430px",
                  overflow: "hidden",
                }}
              >
                <h4
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    zIndex: 1,
                  }}
                >
                  {item.Title}
                </h4>

                <svg
                  ref={(el) => (svgRefs.current[i] = el)}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                ></svg>
              </div>
            ))
          ) : (
            pathInfo.status === "analysed" && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px 0",
                }}
              >
                No paths found for this user.
              </Typography>
            )
          )}
        </div>
      )}
    </>
  );
};

export default AdminPathMap;
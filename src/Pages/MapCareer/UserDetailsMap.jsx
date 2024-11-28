import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading";
import DrawBranch from "../../Utils/DrawBranch";
import { Typography } from "@mui/material";
import useFetch from "point-fetch-react";

const UserDetailsMap = () => {
  const [pathDetailsArray, setPathDetailsArray] = React.useState([]);
  const navigate = useNavigate();
  const svgRefs = useRef([]);

  const { get, Processing } = useFetch({ state: {} });

  const getMapDetails = () => {
    get({
      endPoint: `/get-details-with-path`,
      onSuccess: (res) => {
        setPathDetailsArray(res.data.data || []);
      }
    });
  }

  // getting map details 
  useEffect(() => {
    getMapDetails();
  }, [])

  // creating the map functionlity I am here 
  useEffect(() => {
    if (pathDetailsArray.length > 0) {
      const width = 1000;
      const height = 520;
      const centerY = height / 2;

      for (let index = 0; index < pathDetailsArray.length; index++) {
        const branch = pathDetailsArray[index].branch;
        const svg = d3.select(svgRefs.current[index])
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        DrawBranch(svg, branch, width, height, navigate);
      }
    }
  }, [pathDetailsArray, navigate]);


  return (
    <>
      {Processing ? <Loading processing={Processing} /> : null}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        minHeight: "calc(100vh - 100px)",
        justifyContent: "center"
      }}>
        {pathDetailsArray.length > 0 ? (
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
              <h4 style={{
                position: "absolute",
                top: "12px",
                left: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "5px",
                padding: "5px 10px",
                zIndex: 1,
              }}>
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
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px 0'
            }}
          >
            No Graph found for this user please generate path first...
          </Typography>
        )}
      </div>
    </>
  );

};

export default UserDetailsMap;
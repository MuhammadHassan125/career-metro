import * as d3 from "d3";
import React, { useContext, useEffect, useRef } from "react";
import MapContext from "../../context/MapContext";
import { useParams } from "react-router-dom";
import Loading from "../../Components/Loading";
import useFetch from "point-fetch-react";

const SinglePathMap = ({ onSelectId }) => {
  const svgRef = useRef(null);
  const [singlePathData, setSinglePathData] = React.useState(null);
  const { setGettingSkillsData, setGetTitle, setGetDescription, setNextRole } = useContext(MapContext);
  const params = useParams();
  const singlePathId = params.id;

  const { get, Processing } = useFetch({ state: {} });

  const getIndividualPathData = () => {
    get({
      endPoint: `/get-single-branch/${singlePathId}`,
      onSuccess: (res) => {
        setSinglePathData(res?.data?.data[0]);
      }
    });
  };

  useEffect(() => {
    getIndividualPathData();
  }, []);


  useEffect(() => {
    if (
      singlePathData &&
      singlePathData.steps &&
      singlePathData.steps.length > 0
    ) {
      const width = 1000;
      const height = 400;

      const branch = singlePathData.steps;

      d3.select(svgRef.current).selectAll("*").remove();

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "8px")
        .style("background", "#3749A6")
        .style("color", "white")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("margin-left", "-10px")
        .style("visibility", "hidden")
        .style("pointer-events", "none");

      const tooltipWidth = 120;
      const tooltipHeight = 40;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const xScale = d3
        .scalePoint()
        .domain(branch.map((d) => d.title))
        .range([margin.left, width - margin.right])
        .padding(0.5);

      svg
        .selectAll("line")
        .data(branch.slice(0, -1))
        .enter()
        .append("line")
        .attr("x1", (d) => xScale(d.title))
        .attr("y1", height / 2)
        .attr("x2", (d, i) => xScale(branch[i + 1].title))
        .attr("y2", height / 2)
        .attr("stroke", singlePathData.color)
        .attr("stroke-width", 4);

      svg
        .selectAll("circle")
        .data(branch)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.title))
        .attr("cy", height / 2)
        .attr("r", 8)
        .attr("fill", singlePathData.color)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
          localStorage.setItem("singlePathId", d.id);
          setGetTitle(d.title);
          setGetDescription(d.description);
          setGettingSkillsData(d.skills);
          onSelectId(d.id);
        })
        .on("mouseover", function (event, d) {
          const x = event.clientX;
          const y = event.clientY;
          tooltip
            .style("background", singlePathData.color)
            .style("font-size", "9px")
            .style("padding", "5px 8px")
            .style("top", y - tooltipHeight / 2 + "px")
            .style("left", x - tooltipWidth / 2 + "px")
            .html(`${d.title}`)
            .style("visibility", "visible");
        })
        .on("mousemove", function (event) {
          const x = event.clientX;
          const y = event.clientY;
          tooltip
            .style("top", y - tooltipHeight / 2 + "px")
            .style("left", x - tooltipWidth / 3 + "px");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
        });

      svg
        .selectAll(".node-text")
        .data(branch)
        .enter()
        .append("g")
        .attr("class", "node-text")
        .attr(
          "transform",
          (d) => `translate(${xScale(d.title)},${height / 2 + 20})`
        )
        .each(function (d) {
          const words = d.title.split(" ");
          const text = d3.select(this);

          if (words.length > 2) {
            text
              .append("text")
              .attr("text-anchor", "middle")
              .attr("dy", "0em")
              .style("font-size", "10px")
              .text(words.slice(0, 2).join(" "));

            text
              .append("text")
              .attr("text-anchor", "middle")
              .attr("dy", "1.2em")
              .style("font-size", "10px")
              .text(words.slice(2).join(" "));
          } else {
            text
              .append("text")
              .attr("text-anchor", "middle")
              .style("font-size", "10px")
              .text(d.title);
          }
        });

      for (let i = 0; i < branch.length; i++) {
        if (branch[i].status === "pending") {
          localStorage.setItem("singlePathId", branch[i].id);
          setGetTitle(branch[i].title);
          setGetDescription(branch[i].description);
          setGettingSkillsData(branch[i].skills);
          setNextRole(branch[i].title);
          onSelectId(branch[i].id);
          break;
        }
      }

      return () => {
        tooltip.remove();
      };
    }
  }, [singlePathData]);

  return (
    <React.Fragment>
      {Processing ? <Loading processing={Processing} /> : null}
      <div
        className="scroll-container"
        style={{
          width: "100%",
          position: "relative",
          backgroundColor: "white",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItem: 'center',
          justifyContent: 'center',
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          overflow: "auto",
          overflowY: "hidden",
          height: "105%",
        }}
      >
        {singlePathData && (
          <div
            style={{
              position: "absolute",
              top: "65px",
              left: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "var(--primary-btn-color)",
              borderRadius: "5px",
              padding: "5px 10px",
              zIndex: 1,
              fontWeight: "bold",
            }}
          >
            {singlePathData.pathTitle}
          </div>
        )}

        <svg ref={svgRef}></svg>
      </div>
    </React.Fragment>

  );
};

export default SinglePathMap;
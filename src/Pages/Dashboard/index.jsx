import React, { useState, useEffect } from "react";
import "./index.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UploadDataGrid from "../../Components/DashboardComponents/DataGrid/UploadDataGrid";
import { Link } from "react-router-dom";
import Fire from "../../Fire/Fire";
import { baseURL } from "../../Utils/contants";
import useFetch from "point-fetch-react";
const columns = [
  { Header: "Id", accessor: "id" },
  { Header: "Prompt", accessor: "prompt" },
  { Header: "File Path", accessor: "file" },
  { Header: "Skills", accessor: "total_skill_count" },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => (
      <button
        style={{
          backgroundColor: value === "analyzed" ? "#00B69B" : "grey",
          border: "none",
          outline: "none",
          color: "white",
          borderRadius: "10px",
          padding: "3px 10px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </button>
    ),
  },
  { Header: "", accessor: "Btn" },
];

const data = [
  {
    id: 1,
    Path: "Sales Rep",
    Step: "Senior Sales Rep",
    Date: "12.09.2019 - 12.53 PM",
    Session: "36 hours",
    Status: (
      <button
        style={{
          backgroundColor: "#00B69B",
          border: "none",
          outline: "none",
          color: "white",
          borderRadius: "10px",
          padding: "3px 10px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Active User
      </button>
    ),
  },
  {
    id: 2,
    Path: "Sales Rep",
    Step: "Sales Executive",
    Date: "12.09.2019 - 12.53 PM",
    Session: "42 hours",
    Status: (
      <button
        style={{
          backgroundColor: "#FCBE2D",
          border: "none",
          outline: "none",
          color: "white",
          borderRadius: "10px",
          padding: "3px 10px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Possible Path
      </button>
    ),
  },
  {
    id: 1,
    Path: "Sales Rep",
    Step: "Sales Executive",
    Date: "12.09.2019 - 12.53 PM",
    Session: "16 hours",
    Status: (
      <button
        style={{
          backgroundColor: "#FD5454",
          border: "none",
          outline: "none",
          color: "white",
          borderRadius: "10px",
          padding: "3px 10px",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Different Career
      </button>
    ),
  },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  "@media (max-width: 600px)": {
    width: "90%",
    // p: 2,
  },
};
const Dashboard = () => {
  return (
    <main className="dashboard-section">
      <h2>Dashboard</h2>
      <DashboardCards />
      <UploadDataGrid
        columns={columns}
        heading={"Path Details"}
        dropdown={"October"}
      />
    </main>
  );
};

export default Dashboard;

export const DashboardCards = () => {
  const [cardData, setCardsData] = useState(null);

  const { get } = useFetch({
    state: {},
  });

  const getCardsData = () => {
    get({
      endPoint: `/check-remaining-plans`,
      onSuccess: (res) => {
        console.log(res, "cards data response");
        const apiData = res?.data;

        const transformedData = [
          {
            title: "Remaining Prompts",
            count: apiData.remainingPaths,
            // span: "8.5%",
            // txt: "Up from yesterday",
            // arrow: "/images/arrow-success.png",
            img: "/images/cards-icon (1).png",
          },
          {
            title: "Remaining Training Plan",
            count: apiData.remainingTrainingPlans,
            // span: "4.3%",
            // txt: "Down from yesterday",
            // arrow: "/images/arrow-danger.png",
            img: "/images/cards-icon (4).png",
          },
          {
            title: "Subscription Plan",
            count: apiData.subscriptionPlan,
            // span: "1.8%",
            // txt: "Up from yesterday",
            // arrow: "/images/arrow-success.png",
            img: "/images/cards-icon (2).png",
          },
        ];

        setCardsData(transformedData);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    getCardsData();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
  };
  
  return (
    <>
      <main className="dashboard-cards">
        {cardData && cardData.length > 0 ? (
          cardData.map((item, index) => (
            <div className="dashboard-card-user" key={index}>
              <div className="dashboard-card-heading">
                <div>
                  <h4>{item.title}</h4>
                  <h3>{item.count}</h3>
                </div>
                <div>
                  <img src={item.img} alt="cards icon" />
                </div>
              </div>

              {/* <div className="dashboard-card-bottom">
                <img src={item.arrow} alt="arrow" />
                <span>{item.span}</span>
                <p>{item.txt}</p>
              </div> */}
            </div>
          ))
        ) : (
          <p>The user has not subscribed to any plan yet.</p>
        )}
      </main>

      <main className="dashboard-slider nunito-sans">
        <Slider {...settings}>
          <div className="slider-div">
            {/* <p>September 12-24</p> */}
            <h2>Track and Expand Your Skills </h2>
            <p>Open any role to view and track the skills required for success. </p>
           
            <div style={{display:"flex", alignItems:"center", gap:"10px", marginTop:"10px"}}>
              <img src="/images/banner-check.png" style={{width:"20px", }}/>
              <p>Check off the skills you have already mastered. </p>
            </div>

            <div style={{display:"flex", alignItems:"center", gap:"10px", marginTop:"10px"}}>
              <img src="/images/banner-check.png" style={{width:"20px", }}/>
              <p>Add new skills to focus on for your growth.  </p>
            </div>

            <div style={{display:"flex", alignItems:"center", gap:"10px", marginTop:"10px"}}>
              <img src="/images/banner-check.png" style={{width:"20px", }}/>
              <p>Stay organised with a personalised progress tracker for each role. </p>
            </div>

            <p style={{marginTop:"20px"}}>Take actionable steps towards building the expertise you need for your dream role. </p>
            <Link to="/add-path">
              <button>Get Started</button>
            </Link>
          </div>


          <div className="slider-div">
            <h2>Join the 8% of people <br/> who achieve their goals. </h2>

              <div style={{display:"flex", flexDirection:"column",gap:"10px", marginTop:"10px"}}>
                <p>1. Create your first prompt. </p>
                <p>2. Select the path on the Career Maps Tab.  </p>
                <p>3. Export your training plan</p>
                <p>4. Receive a structured roadmap tailored to your career
                aspirations.  </p>
              </div>
            <Link to="/add-path">
              <button>Get Started</button>
            </Link>
          </div>
          
        </Slider>
      </main>
    </>
  );
};

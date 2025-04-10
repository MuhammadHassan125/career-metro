import './index.scss';
import UploadDataGrid from '../../Components/DashboardComponents/DataGrid/UploadDataGrid';
import RevenueChart from '../../Components/AdminDashboard/TrackChart';
import React, { useEffect } from 'react';
import useFetch from 'point-fetch-react';


const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "Prompt", accessor: "prompt" },
    { Header: "File Path", accessor: "file" },
    { Header: "Skills", accessor: "total_skill_count" },
  {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <button style={{
          backgroundColor: value === 'analyzed' ? '#00B69B' : 'grey',
          border: 'none',
          outline: 'none',
          color: 'white',
          borderRadius: '10px',
          padding: '3px 10px',
          cursor: 'pointer',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </button>
      )
    },  { Header: "", accessor: "Btn" },
  ];

const data = [
    {
        id: 1,
        Path: "Sales Rep",
        Step: "Senior Sales Rep",
        Date: "12.09.2019 - 12.53 PM",
        Session: "36 hours",
        Status: (
            <button style={{
                backgroundColor: '#00B69B', border: 'none', outline: 'none',
                color: 'white', borderRadius: '10px', padding: '3px 10px', cursor: "pointer"
            }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
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

            <button style={{
                backgroundColor: '#FCBE2D', border: 'none', outline: 'none',
                color: 'white', borderRadius: '10px', padding: '3px 10px', cursor: "pointer"
            }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
                Possible Path
            </button>),
    },
    {
        id: 1,
        Path: "Sales Rep",
        Step: "Sales Executive",
        Date: "12.09.2019 - 12.53 PM",
        Session: "16 hours",
        Status: (
            <button style={{
                backgroundColor: '#FD5454', border: 'none', outline: 'none',
                color: 'white', borderRadius: '10px', padding: '3px 10px', cursor: "pointer"
            }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
                Different Career
            </button>
        ),
    },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: 'none',
    outline: 'none',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    '@media (max-width: 600px)': {
        width: '90%',
        // p: 2,
    }
};


const AdminDashboard = () => {
    const [userRole, setUserRole] = React.useState('');

    React.useEffect(()=> {
        const role = localStorage.getItem('user-role');
        setUserRole(role);
    }, []);
    
    return (
        <main className='dashboard-section' id="chart">
            {/* {userRole === "Super Admin" ? <h2>Super Admin Dashboard</h2> : <h2>Admin Dashboard</h2>} */}
            {userRole === "Super Admin" ? <h2>Super Admin Dashboard</h2>:
            userRole === "Admin" ? <h2>Admin Dashboard</h2> : 
            userRole === "Sub Admin" ? <h2>Sub Admin Dashboard</h2>: null
            }
            <DashboardCards />
            <UploadDataGrid columns={columns} heading={"Path Details"} dropdown={""} />

        </main>
    )
}

export default AdminDashboard;

export const DashboardCards = () => {

  const [cardsData, setCardsData] = React.useState([]);
  const { get } = useFetch({
    state: {},
  });

  const getCardsData = () => {
    get({
      endPoint: `/get-analytics`,
      onSuccess: (res) => {
        console.log(res, "cards data response");
        const apiData = res?.data?.result;

        const transformedData = [
          {
            title: "Total Users",
            count: apiData.totalUsers,
            span: "8.5%",
            txt: "Up from yesterday",
            arrow: "/images/arrow-success.png",
            img: "/images/cards-icon (1).png",
          },
          {
            title: "Total Paths",
            count: apiData.totalPaths,
            span: "4.3%",
            txt: "Down from yesterday",
            arrow: "/images/arrow-danger.png",
            img: "/images/cards-icon (4).png",
          },
          {
            title: "Paths Pending",
            count: apiData.pendingPaths,
            span: "1.8%",
            txt: "Up from yesterday",
            arrow: "/images/arrow-success.png",
            img: "/images/cards-icon (2).png",
          },
          {
            title: "Purchase Subscription",
            count: apiData.purchaseSubscription,
            span: "1.3%", 
            txt: "Up from past week",
            arrow: "/images/arrow-success.png",
            img: "/images/cards-icon (3).png",
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

  return (
    <>
      <main className="dashboard-cards">
        {cardsData.map((item, index) => (
          <div className="dashboard-card-div" key={index}>
            <div className="dashboard-card-heading">
              <div>
                <h4>{item.title}</h4>
                <h2>{item.count}</h2>
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
        ))}
      </main>

      <div style={{ backgroundColor: "white", borderRadius: "10px", width: "100%" }}>
        <RevenueChart heading={"Popular Tracks"} dropdown={"dropdown"} />
      </div>
    </>
  );
};

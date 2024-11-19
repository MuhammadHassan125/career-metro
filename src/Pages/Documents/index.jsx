import React from 'react';
import './index.scss';
import PrimaryBtn from '../../Components/PrimaryBtn';
import DataGrid from '../../Components/DashboardComponents/DataGrid/DataGrid';
import { useNavigate } from 'react-router-dom';

const columns = [
    { Header: "File Name", accessor: "Path" },
    { Header: "Date", accessor: "Date" },
    { Header: "Status", accessor: "Status" },
    { Header: "Skills", accessor: "Skills" },
    { Header: "", accessor: "Btn" },
];

const data = [
    {
        id: 1,
        Path: "designer-resume.pdf",
        Date: "12-09-2024",
        Skills: "4",
        Status: (
            <button style={{
                backgroundColor: '#00B69B', border: 'none', outline: 'none',
                color: 'white', borderRadius: '10px', padding: '3px 10px', cursor: "pointer"
            }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
                Scanned
            </button>
        ),
        Btn: (
            <p>Analyze Again</p>
        )
    },
    {
        id: 2,
        Path: "Sales Rep",
        Date: "12.09.2019 - 12.53 PM",
        Points: "423",
        Skills: "2",
        Status: (

            <button style={{
                backgroundColor: '#E8E8E8', border: 'none', outline: 'none',
                borderRadius: '10px', padding: '3px 10px', cursor: "pointer"
            }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
                Pending
            </button>),
        Btn: (
            <button
                style={{ backgroundColor: '#3749A6', border: 'none', outline: 'none', color: 'white', borderRadius: '5px', padding: '5px 10px', cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >Analyze Again</button>
        )
    },

];


const Documents = () => {
    const navigate = useNavigate();
    const Onnavigate = () => {
        navigate('/documents-upload')
    }
    return (
            <main className="documents-section">
                {/* heading  */}
                <div className='main__heading'>
                    <h2>
                        All Paths
                    </h2>
                    <PrimaryBtn onClick={Onnavigate} text="Add path or Cv" />
                </div>

                <DataGrid columns={columns} data={data} heading={"Uploaded CV's"} dropdown={"October"} />
            </main>
    )
};

export default Documents
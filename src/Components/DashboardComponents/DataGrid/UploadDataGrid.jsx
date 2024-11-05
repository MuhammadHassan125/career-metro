import { useState, useEffect } from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowDown } from "react-icons/md";
import { Pagination, Typography } from '@mui/material';
import Loading from '../../Loading';
import useFetch from 'point-fetch-react';
import { AiOutlineEdit } from "react-icons/ai";
import { AnalyzeURL } from '../../../Utils/contants';
import Fire from '../../../Fire/Fire';

const UploadDataGrid = ({ heading, dropdown }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const navigate = useNavigate();

  const { get, post} = useFetch({ state: {} });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const getUploadDataList = () => {
    get({
      endPoint: `/get-paths-for-user`,
      onSuccess: (res) => {
        setData(res.data.data.result || []);
        console.log('data', res);
      },
      onError: (err) => {
        console.log(err);
        setData([]);
      },
    });
  };

  const generate_roadmap = (id, status) => {
    Fire.post({
      url: `${AnalyzeURL}/${status === 'pending' ? "generate_roadmap" : "regenerate_roadmap"}?id=${id}`,
      onSuccess: (res) => {
        console.log(res);
        // Snackbar(res?.data?.message, { variant: 'success' });
        setLoading(false);
        getUploadDataList();
      },
      onError: (err) => {
        console.log(err);
      }
    });
  };

  const handleEdit = (rowData) => {
    navigate(`/path/${rowData.id}/edit`, {state:rowData}); 
  };

  const columns = [
    { Header: "Id", accessor: "id" },
    {
      Header: "Title", accessor: "title",
      Cell: ({ value }) => (
        <Typography sx={{ fontSize: "13px" }}>
          {value ? (value.length > 40 ? `${value.substring(0, 40)}......` : value) : 'No Data'}
        </Typography>
      )
    },
    // { Header: "Path", accessor: "file" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <Typography
          sx={{
            textTransform: 'capitalize',
            backgroundColor: value === 'pending' || value === 'analyzed' ? '#00B69B' : '#E8E8E8',
            color: value === 'pending' || value === 'analyzed' ? 'white' : '#354E70',
            borderRadius: '10px',
            padding: '3px 0',
            textAlign:'center',
            cursor: 'pointer',
            fontSize: '11px',
             width:'70px',
            // height:'25px'
          }}
        >
          {value}
        </Typography>
      )
    },
    { Header: "Skills", accessor: "total_skill_count" },
    {
      Header: "Edit",
      accessor: "edit",
      Cell: ({ row }) => (
        <div
          style={{
            cursor: 'pointer', 
            background: '#E8E8E8', 
            padding: '6px', 
            borderRadius: "20px", 
            fontSize: "12px",
            textAlign:'center',
            width:'25px',
            height:'25px'
          }}
          onClick={() => handleEdit(row)}
        >
          <AiOutlineEdit  />
        </div>
      )
    },
    {
      Header: "",
      accessor: "status",
      Cell: ({ value, row }) => (
        <button
          onClick={() => (value === 'pending' || value === 'analysed') && generate_roadmap(row.id, value)}
          style={{
            backgroundColor: value === 'pending' || value === 'analysed' ? '#3749A6' : 'transparent',
            border: value === 'pending' || value === 'analysed' ? '1px solid #3749A6' : '1px solid grey',
            color: value === 'pending' || value === 'analysed' ? 'white' : '#354E70',
            borderRadius: '2.5px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '10px',
          }}
        >
          {value === 'pending' ? 'Analyse' : value === 'analysed' ? 'Reanalyse' : 'Analysing'}
        </button>
      )
    },
  ];

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getUploadDataList();
  
    const pollInterval = setInterval(() => {
      getUploadDataList();
    }, 20000);
  
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <>
      <Loading />
      <section className="data-grid">
        <div className='data-grid__heading'>
          <h3>{heading}</h3>
          <button>
            {dropdown}
            <MdKeyboardArrowDown />
          </button>
        </div>

        {data.length === 0 ? (
          <div className="no-data">
            <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>No data available</Typography>
          </div>
        ) : (
          <>
            <div className="data-grid__container">
              <table className="data-grid__table">
                <thead>
                  <tr className="data-grid__header-row">
                    {columns.map((col, index) => (
                      <th key={index} className="data-grid__header-cell">
                        {col.Header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((row, rowIndex) => (
                      <tr key={rowIndex} className="data-grid__body-row">
                        {columns.map((col, colIndex) => (
                          <td key={colIndex} className="data-grid__body-cell">
                            {col.Cell ? col.Cell({ value: row[col.accessor], row }) : (row[col.accessor] !== null ? row[col.accessor] : 'No Data')}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="data-grid__body-cell">
                        No items to display
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
            <Pagination
              count={Math.ceil(data.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </section>
    </>
  );
};

export default UploadDataGrid;

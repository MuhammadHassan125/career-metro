import useFetch from "point-fetch-react";
import React, { useEffect, useState } from "react";
import Loading from "../../Components/Loading";
import { Pagination, Typography } from "@mui/material";
import "../../Components/DashboardComponents/DataGrid/index.scss";

const AdminActivity = () => {
  const [activityData, setActivityData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivityLogs, setTotalActivityLogs] = useState(0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activityData.slice(indexOfFirstItem, indexOfLastItem);

  const { get, Processing } = useFetch({
    state: {},
  });

  const gettingActivityLogs = () => {
    get({
      endPoint: "/get-activity-logs",
      onSuccess: (res) => {
        console?.log(res, "activity logs");
        setActivityData(res?.data?.activity_logs);
        setTotalActivityLogs(res?.data?.totalActivityLogs); // Update totalActivityLogs
        setTotalPages(res?.data?.totalPages); // Update totalPages
      },
      onErros: (err) => {
        console?.log(err);
      },
    });
  };

  useEffect(() => {
    gettingActivityLogs();
  }, []);

  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "UserName", accessor: "username" },
    { Header: "Name", accessor: "name" },
  ];

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      {Processing ? <Loading processing={Processing} /> : null}
      <section className="data-grid">
        <div className="data-grid__heading">
          <h3>Activity Logs</h3>
        </div>

        {activityData.length === 0 ? (
          <div className="no-data">
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px 0",
              }}
            >
              No data available
            </Typography>
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
                            {col.Cell
                              ? col.Cell({ value: row[col.accessor], row })
                              : row[col.accessor] !== null
                              ? row[col.accessor]
                              : "No Data"}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="data-grid__body-cell"
                      >
                        No items to display
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              count={totalPages} 
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

export default AdminActivity;

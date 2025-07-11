import React, { useState } from "react";
import useFetch from "point-fetch-react";
import Loading from "../../Components/Loading";
import { Pagination, Typography } from "@mui/material";
import "../../Components/DashboardComponents/DataGrid/index.scss";
import UpdatePath from "../../Components/AdminDashboard/UpdatePath";
import { AiOutlineEdit } from "react-icons/ai";
import { BsFillEyeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { IoEyeOffSharp } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import Fire from "../../Fire/Fire";
import { baseURL } from "../../Utils/contants";
import { Snackbar } from "../../Utils/SnackbarUtils";
import { hasSlugAction } from "../../Utils/SlugPermission";

const AdminPaths = () => {
  const [path, setPath] = useState([]);
  const [pathId, setPathId] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPaths, setTotalPaths] = useState(0);
  const [expandedRows, setExpandedRows] = React.useState({});

  const { get, Processing } = useFetch({ state: {} });
  const navigate = useNavigate();

  const roleName = localStorage.getItem("user-role");
  const canUpdate = hasSlugAction(roleName, "paths-update");
  const canView = hasSlugAction(roleName, "paths-view");
  const canDelete = hasSlugAction(roleName, "paths-delete");

  const gettingAdminPaths = (page = 1) => {
    get({
      endPoint: `/get-all-paths-for-admin-panel?page=${page}`,
      onSuccess: (res) => {
        setPath(res?.data?.paths);
        setTotalPages(res?.data?.totalPages);
        setTotalPaths(res?.data?.totalPaths);
        setCurrentPage(res?.data?.currentPage);
      },
    });
  };

  React.useEffect(() => {
    gettingAdminPaths(currentPage);
  }, []);

  const handleUpdatePath = (id, prompt) => {
    handleOpen();
    setPathId(id);
    setPrompt(prompt);
  };

  const handleDeletePath = (id) => {
    Fire.delete({
      url: `${baseURL}/delete-path-related-data/${id}`,
      onSuccess: (res) => {
        console.log(res, "path delete successfully");
        Snackbar(res.data.message, {
          variant: "success",
          style: { backgroundColor: "var(--primary-btn-color)" },
        });
        gettingAdminPaths(currentPage);
      },
      onError: (err) => {
        Snackbar(err, { variant: "error" });
      },
    });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    gettingAdminPaths(newPage);
  };

  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "UserName", accessor: "username" },
    { Header: "Title", accessor: "title" },
    // { Header: "Prompt", accessor: "prompt" },
    {
      Header: "Prompt",
      accessor: "prompt",
      Cell: ({ value, row }) => {
        const maxLength = 40;
        const isExpanded = expandedRows[row.id] || false;

        if(!value) return <p>No prompt available</p>

        return (
          <div>
            {isExpanded ? (
              <div>
                {value}
                <button
                  onClick={() =>
                    setExpandedRows((prev) => ({ ...prev, [row.id]: false }))
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8c9eb1",
                    cursor: "pointer",
                    marginLeft: "5px",
                    fontSize: "12px",
                  }}
                >
                  Show Less
                </button>
              </div>
            ) : (
              <div>
                {value.length > maxLength
                  ? `${value.substring(0, maxLength)}...`
                  : value}
                {value.length > maxLength && (
                  <button
                    onClick={() =>
                      setExpandedRows((prev) => ({ ...prev, [row.id]: true }))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "#68819b",
                      cursor: "pointer",
                      marginLeft: "5px",
                      fontSize: "12px",
                    }}
                  >
                    Show More
                  </button>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <Typography
          sx={{
            textTransform: "capitalize",
            backgroundColor:
              value === "Pending" || value === "Admin" ? "#879aad" : "#E8E8E8",
            color:
              value === "Analysed" || value === "Admin" ? "#E8E8E8" : "#354E70",
            borderRadius: "10px",
            padding: "3px 2px",
            textAlign: "center",
            cursor: "pointer",
            fontSize: "11px",
            width: "80px",
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      Header: "Edit",
      accessor: "edit",
      Cell: ({ row }) => {
        const { id, prompt, status } = row;
        return (
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {canView ? (
              status === "analysed" ? (
                <BsFillEyeFill
                  onClick={() => navigate(`/admin-paths/${id}`)}
                  style={{
                    backgroundColor: "#E8E8E8",
                    width: "22px",
                    height: "22px",
                    fontSize: "10px",
                    padding: "4px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                />
              ) : (
                <IoEyeOffSharp
                  style={{
                    backgroundColor: "#E8E8E8",
                    width: "22px",
                    height: "22px",
                    fontSize: "10px",
                    padding: "4px",
                    borderRadius: "50%",
                  }}
                />
              )
            ) : null}

            {canDelete && (
              <AiOutlineDelete
                onClick={() => handleDeletePath(id)}
                style={{
                  backgroundColor: "#E8E8E8",
                  width: "22px",
                  height: "22px",
                  fontSize: "10px",
                  padding: "4px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              />
            )}
            {canUpdate && (
              <AiOutlineEdit
                onClick={() => handleUpdatePath(id, prompt)}
                style={{
                  backgroundColor: "#E8E8E8",
                  width: "22px",
                  height: "22px",
                  fontSize: "10px",
                  padding: "4px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {Processing ? <Loading processing={Processing} /> : null}
      <section className="data-grid">
        <div className="data-grid__heading">
          <h3>Paths List</h3>
        </div>

        {path?.length === 0 ? (
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
                  {path.map((row, rowIndex) => (
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
                  ))}
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

      <UpdatePath
        open={open}
        handleClose={handleClose}
        getPathList={() => gettingAdminPaths(currentPage)}
        pathId={pathId}
        prompt={prompt}
      />
    </>
  );
};

export default AdminPaths;

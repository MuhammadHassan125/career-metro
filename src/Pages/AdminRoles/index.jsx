import React, { useEffect } from "react";
import "./index.scss";
import AddRolesModal from "../../Components/AdminDashboard/AddRolesModal";
import UpdateRoleModal from "../../Components/AdminDashboard/UpdateRoleModal";
import useFetch from "point-fetch-react";
import { Pagination, Typography } from "@mui/material";
import Loading from "../../Components/Loading";
import { AiOutlineEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { hasSlugAction } from "../../Utils/SlugPermission";

const AdminRoles = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [id, setId] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const [data, setData] = React.useState([]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(4);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const navigate = useNavigate();

  const { get, Processing } = useFetch({
    state: {},
  });

  const roleName = localStorage.getItem("user-role");
  const canEdit = hasSlugAction(roleName, "edit");
  const canCreate = hasSlugAction(roleName, "create");


  const handleGetRoles = () => {
    get({
      endPoint: `/get-role`,
      onSuccess: (res) => {
        setData(res?.data?.results);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    handleGetRoles();
  }, []);

  const handleUpdateUser = (id) => {
    setId(id);
    setEditOpen(true);
  };

  const handleUpdateClose = () => {
    setEditOpen(false);
    setUserId(null);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const columns = [
    { Header: "Id", accessor: "id" },
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ value }) => (
        <Typography sx={{ fontSize: "13px" }}>{value}</Typography>
      ),
    },
    {
      Header: "Created at",
      accessor: "created_at",
      Cell: ({ value }) => (
        <Typography sx={{ fontSize: "13px" }}>{formatDate(value)}</Typography>
      ),
    },
    {
      Header: "Edit",
      accessor: "edit",
      Cell: ({ row }) => {
        const { id } = row;
        return canEdit ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <AiOutlineEdit
              onClick={() => navigate(`/edit-role/${id}`)}
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
          </div>
        ) : null;
      },
    },
  ];
  
  return (
    <>
      {Processing ? <Loading processing={Processing} /> : null}
      <section className="data-grid">
        <div className="data-grid__heading">
          <h3>Roles</h3>
          {canCreate ? (
            <button
              onClick={handleOpen}
              style={{
                backgroundColor: "#879aad",
                color: "#E8E8E8",
                fontSize: "12px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")} 
            >
              Add Role
            </button>
          ) : null}
        </div>

        {data.length === 0 ? (
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
              count={Math.ceil(data.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </section>

      <AddRolesModal open={open} handleClose={handleClose} />
      <UpdateRoleModal
        open={editOpen}
        handleClose={handleUpdateClose}
        id={id}
      />
    </>
  );
};

export default AdminRoles;

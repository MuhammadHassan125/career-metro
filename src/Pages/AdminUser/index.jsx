import useFetch from "point-fetch-react";
import React, { useEffect, useState } from "react";
import { Box, Button, Pagination, Typography } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import Loading from "../../Components/Loading";
import "../../Components/DashboardComponents/DataGrid/index.scss";
import CreateUser from "../../Components/AdminDashboard/CreateUser";
import UpdateUser from "../../Components/AdminDashboard/UpdateUser";
import { Snackbar } from "../../Utils/SnackbarUtils";
import Fire from "../../Fire/Fire";
import { baseURL } from "../../Utils/contants";
import { hasSlugAction } from "../../Utils/SlugPermission";
import { useNavigate } from "react-router-dom";
import AssignUserModal from "../../Components/AdminDashboard/AssignUserModal";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { get, destroy, Processing } = useFetch({ state: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userId, setUserId] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const [subAdminId, setSubAdminId] = React.useState(null);
  const [subAdminOpen, setSubAdminOpen] = React.useState(false);

  const roleName = localStorage.getItem("user-role");
  const canCreate = hasSlugAction(roleName, "create");
  const canEdit = hasSlugAction(roleName, "update");
  const canDelete = hasSlugAction(roleName, "delete");

  const showSkillToAdmin =
    hasSlugAction(roleName, "skills-delete") ||
    hasSlugAction(roleName, "skills-update");

  const handleUpdateUser = (id) => {
    setUserId(id);
    setEditOpen(true);
  };

  const handleUpdateClose = () => {
    setEditOpen(false);
    setUserId(null);
  };
  const getAllUser = () => {
    get({
      endPoint: `/get-all-users`,
      onSuccess: (res) => {
        setData(res.data.users);
      },
      onError: (err) => {
        setData([]);
      },
    });
  };

  const handleDeleteUser = (id) => {
    Fire.delete({
      url: `${baseURL}/delete-user/${id}`,
      onSuccess: (res) => {
        getAllUser();
        Snackbar(res.data.message, {
          style: { backgroundColor: "var(--primary-btn-color)" },
          variant: "success",
        });
      },
      onError: (err) => {
        Snackbar(err || "Access Denied - Super Admin only have access", {
          variant: "error",
        });
      },
    });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleAssignUserOpen = (id) => {
    setSubAdminOpen(true);
    setSubAdminId(id);
  }

  const handleAssignUserClose = () => {
    setSubAdminOpen(false);
    setSubAdminId(null);
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "Username", accessor: "username" },
    {
      Header: "Email",
      accessor: "email",
      Cell: ({ value }) => (
        <Typography sx={{ fontSize: "13px" }}>
          {value
            ? value.length > 40
              ? `${value.substring(0, 40)}......`
              : value
            : "No Data"}
        </Typography>
      ),
    },
    {
      Header: "Created At",
      accessor: "created_at",
      Cell: ({ value }) => {
        const formattedDate = new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return (
          <Typography sx={{ fontSize: "12px" }}>{formattedDate}</Typography>
        );
      },
    },
    {
      Header: "Role",
      accessor: "role",
      Cell: ({ value }) => (
        <Typography
          sx={{
            textTransform: "capitalize",
            backgroundColor:
              value === "Super Admin" || value === "Admin"
                ? "#879aad"
                : "#E8E8E8",
            color:
              value === "Super Admin" || value === "Admin"
                ? "#E8E8E8"
                : "#354E70",
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
        const { id } = row;
        // console.log(row,'fffffffffffff')
        return (
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {showSkillToAdmin ? (
              <button
                style={{
                  backgroundColor: "#E8E8E8",
                  height: "22px",
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
                onClick={() => navigate(`/admin-skills/${id}`)}
              >
                Skills
              </button>
            ) : null}

            {canEdit ? (
              <AiOutlineEdit
                onClick={() => handleUpdateUser(id)}
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
            ) : null}

            {canDelete ? (
              <AiOutlineDelete
                onClick={() => handleDeleteUser(id)}
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
            ) : null}
           {row.role !== "User" && row.role !== "Super Admin" && roleName === 'Super Admin' ? (
              <button
                style={{
                  backgroundColor: "#E8E8E8",
                  height: "22px",
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  width: "80px",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
                onClick={() => handleAssignUserOpen(id)}
              >
                Assign Role
              </button>
            ) : null}
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
          <h3>Users List</h3>

          {canCreate && roleName === 'Super Admin' ? (
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
              Add User
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

      <CreateUser
        open={open}
        handleClose={handleClose}
        getAllUser={getAllUser}
      />

      <UpdateUser
        open={editOpen}
        handleClose={handleUpdateClose}
        userId={userId}
        getAllUser={getAllUser}
        UserPassword
      />

      <AssignUserModal
        open={subAdminOpen}
        handleClose={handleAssignUserClose}
        subAdminId={subAdminId}
      />
    </>
  );
};

export default AdminUsers;

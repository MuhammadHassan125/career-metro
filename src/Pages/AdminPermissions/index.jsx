import useFetch from "point-fetch-react";
import React, { useEffect, useState, useRef } from "react";
import Loading from "../../Components/Loading";
import { Pagination, Typography } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import CreatePermissionsModal from "../../Components/AdminDashboard/CreatePermissionsModal";
import UpdatePermissionsModal from "../../Components/AdminDashboard/UpdatePermissionsModal";
import { hasSlugAction } from "../../Utils/SlugPermission";

const AdminPermissions = () => {
  const modelRef = useRef();
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [id, setId] = React.useState(null);
  const [getModuleName, setGetModuleName] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const roleName = localStorage.getItem("user-role");
  const canEdit = hasSlugAction(roleName, "edit");
  const canCreatePermission = hasSlugAction(roleName, "create");

  const handleUpdateUser = (row,id, getpermissions, moduleName) => {
    
    setEditOpen(true);
    const filteredPermissions = getpermissions.map(
      ({ permissionId, permissionName }) => ({
        permissionId,
        permissionName,
      })
    );

    modelRef.current.setData(row,filteredPermissions)

    setPermissions(filteredPermissions);
    setId(id);
    setGetModuleName(moduleName);
  };

  const handleUpdateClose = () => {
    setEditOpen(false);
    setId(null);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const { get, Processing } = useFetch({
    state: {},
  });

  const handleGetPermissionsList = () => {
    get({
      endPoint: `/get-all-permissions`,
      onSuccess: (res) => {
        setData(res?.data?.permissionsByModule);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    handleGetPermissionsList();
  }, []);

  const columns = [
    { Header: "Module ID", accessor: "id" },
    { Header: "Module Name", accessor: "moduleName" },
    {
      Header: "Permissions",
      accessor: "permissions",
      Cell: ({ value }) => (
        <Typography sx={{ fontSize: "13px" }}>
          {value && value.length > 0
            ? value.map((permission) => permission.permissionName).join(", ")
            : "No Data"}
        </Typography>
      ),
    },
    {
      Header: "Created At",
      accessor: "createdAt",

      Cell: ({ row }) => {
        const permissions = row?.original?.permissions || [];
        return (
          <Typography sx={{ fontSize: "13px" }}>
            {permissions.length > 0
              ? permissions.map((permission) => permission.createdAt).join(", ")
              : "No Data"}
          </Typography>
        );
      },
    },
    {
      Header: "Edit",
      accessor: "edit",
      Cell: ({ row }) => {
        const { id, permissions, moduleName } = row;
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {canEdit ? (
              <AiOutlineEdit
              onClick={() => handleUpdateUser(row,id, permissions, moduleName)}
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
          <h3>Permissions List</h3>
          {canCreatePermission ? (

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
            Create Permission
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

      <CreatePermissionsModal
        open={open}
        handleClose={handleClose}
        handleGetPermissionsList={handleGetPermissionsList}
      />

      <UpdatePermissionsModal
        ref={modelRef}
        id={id}
        handleGetPermissionsList={handleGetPermissionsList}
        handleClose={handleUpdateClose}
        open={editOpen}
        permissions={permissions}
        getModuleName={getModuleName}
      />
    </>
  );
};

export default AdminPermissions;

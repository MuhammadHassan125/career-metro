import useFetch from "point-fetch-react";
import React, { useEffect, useState } from "react";
import Loading from "../../Components/Loading";
import { Pagination, Typography } from "@mui/material";
import "../../Components/DashboardComponents/DataGrid/index.scss";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import Fire from "../../Fire/Fire";
import { baseURL } from "../../Utils/contants";
import { Snackbar } from "../../Utils/SnackbarUtils";
import UpdateSkills from "../../Components/AdminDashboard/UpdateSkills";

const AdminSkills = () => {
  const [skillsData, setSkillsData] = useState([]);
  const [skillsId, setSkillsId] = useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [id, setId] = useState(null);
  const [skillTitle, setSkillsTitle] = useState('');
  const [skillStatus, setSkillStatus] = useState('');
  const [stepId, setStepId] = useState(null);
//   const [selectedSkill, setSelectedSkill] = useState({
//     id: null,
//     title: "",
//     status: "",
//     stepId: null,
//   });

  // for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(4);

  const { get, Processing } = useFetch({ state: {} });

  const gettingSkillsList = () => {
    get({
      endPoint: `/get-all-skills-for-admin-panel?page=${currentPage}&limit=${itemsPerPage}`,
      onSuccess: (res) => {
        console.log(res, "admin-skills");
        setSkillsData(res?.data?.skills || []);
        setTotalPages(res?.data?.totalPages || 1);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    gettingSkillsList();
  }, [currentPage]);

const handleUpdateSkills = (id, title, step_id, status) => {
    setId(id);
    setSkillsTitle(title);
    setSkillStatus(status);
    setStepId(step_id);
    handleOpen();
};

  const handleDeleteSkill = (id) => {
    Fire.delete({
      url: `${baseURL}/delete-user/${id}`,
      onSuccess: (res) => {
        console.log(res);
        getAllUser();
        Snackbar(res.data.message, {
          style: { backgroundColor: "var(--primary-btn-color)" },
          variant: "success",
        });
      },
      onError: (err) => {
        console.log(err, 'ddddddddddddddd');
        Snackbar(err 
            || 'Access Denied - Super Admin only have access', { variant: "error" });
      },
    });
  };

  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "UserName", accessor: "username" },
    { Header: "Title", accessor: "title" },
    {
      Header: "Status",
      accessor: "status",
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
        const {id, step_id, title, status} = row;
        return (
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <AiOutlineEdit
              onClick={() => handleUpdateSkills(id, step_id, status, title)}
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

            <AiOutlineDelete
              onClick={() => handleDeleteSkill(id)}
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
        );
      },
    },
  ];

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      {Processing ? <Loading processing={Processing} /> : null}
      <section className="data-grid">
        <div className="data-grid__heading">
          <h3>Skills List</h3>
        </div>

        {skillsData?.length === 0 ? (
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
                  {skillsData.map((row, rowIndex) => (
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

      <UpdateSkills
        open={open}
        gettingSkillsList={gettingSkillsList}
        // selectedSkill={selectedSkill} 
        handleClose={handleClose}
        id={id}
        skillTitle={skillTitle}
        skillStatus={skillStatus}
        stepId={stepId}
      />
    </>
  );
};

export default AdminSkills;

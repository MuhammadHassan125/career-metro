import React, { useEffect } from 'react';
import { IoCheckmarkSharp } from "react-icons/io5";
import './index.scss';
import { useParams } from 'react-router-dom';
import Loading from '../../Components/Loading';
import useFetch from 'point-fetch-react';
import AddSkills from '../../Components/DashboardComponents/DataGrid/AddSkills';
import EditSkills from '../../Components/DashboardComponents/DataGrid/EditSkills';
import { AiTwotoneDelete } from "react-icons/ai";
import { AiTwotoneEdit } from "react-icons/ai";
import Fire from '../../Fire/Fire';
import { baseURL } from '../../Utils/contants';

const ListCareerPath = () => {
  const [selectedId, setSelectedId] = React.useState(null);
  const [listData, setListData] = React.useState([]);
  const params = useParams();
  const { get, destroy, Processing } = useFetch({state:{}});


  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editSkillId, setEditSkillId] = React.useState(null);
  const [editSkillTitle, setEditSkillTitle] = React.useState("");
  const [editOpen, setEditOpen] = React.useState(false);

  const handleEditOpen = (id, title) => {
    setEditSkillId(id);
    setEditSkillTitle(title);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditSkillId(null);
  };
  const handleSelect = (id) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      handleUpdateSkills(id);
    }
  };

  const handleSubmit = () => {
    get({
      endPoint: `/get-skills-for-single-step/${params.id}`,
      onSuccess: (res) => {
        console.log('API Response:', res?.data?.data?.skills); 
        setListData(res?.data?.data?.skills || []);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const handleUpdateSkills = (id) => {
    get({
      endPoint: `/check-status-of-skills/${id}`,
      onSuccess: (res) => {
        console.log(res, '')
        if (res?.data?.status === "completed") {
          setSelectedId(id);
        } else {
          setSelectedId(null);
        }
        handleSubmit();
      },
      onError: (err) => {
        console.log(err)
      }
    })
  };

  
  const handleDelete = (id) => {
    destroy({
      endPoint: `/delete-skill/${id}`,
      onSuccess: (res) => {
        console.log(res);
        handleSubmit();
      },
      onError: (err) => {
        console.log(err);
        Snackbar(err.error, { variant: "error" });
      },
    });
  };

  useEffect(() => {
      handleSubmit();
  }, []);

  return (
    <React.Fragment>
      {Processing ? <Loading processing={Processing}/> : null}
      <main className="list-section">
        <div className="main__heading">
          <div>
            <h2>
              Skill Tracker
            </h2>
          </div>

          <div className="map-section__btn-div">
            <button className="map-section__btn" onClick={handleOpen}>
              Add Skill
            </button>
          </div>
        </div>

        <div className="list-section__content">
          {listData?.length > 0 ? (
            listData?.map((item) => {
              return (
                <div
                  key={item.id}
                  className="list-section__content__div"
                  style={{
                    backgroundColor:
                      selectedId === item.id || item.status === "completed"
                        ? "var(--primary-btn-color)"
                        : "white",
                  }}
                >
                  <div>
                    <button
                      onClick={() => handleSelect(item.id)}
                      style={{
                        color:
                          selectedId === item.id || item.status === "completed"
                            ? "white"
                            : null,
                        borderColor:
                          selectedId === item.id || item.status === "completed"
                            ? "white"
                            : null,
                      }}
                    >
                      {selectedId === item.id || item.status === "completed" ? (
                        <IoCheckmarkSharp style={{ color: "white" }} />
                      ) : null}
                    </button>
                    <p
                      style={{
                        color:
                          selectedId === item.id || item.status === "completed"
                            ? "white"
                            : "var(--primary-btn-color)",
                      }}
                    >
                      {item.title}
                    </p>
                  </div>

                  {/* right side items  */}
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        color: item.status === "pending" ? "white" : "blue",
                        backgroundColor:
                          item.status === "pending"
                            ? "var(--primary-btn-color)"
                            : "#f5f6fd",
                      }}
                    >
                      <p>{item.status}</p>
                    </div>
                    <AiTwotoneEdit
                      onClick={() => handleEditOpen(item.id, item.title)}
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    />
                    <AiTwotoneDelete
                      onClick={handleDelete.bind(this, item.id)}
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            null
          )}
        </div>
      </main>

      <AddSkills
        open={open}
        handleClose={handleClose}
        stepId={params.id}
        handleSubmit={handleSubmit}
      />
      <EditSkills
        open={editOpen}
        handleClose={handleEditClose}
        skillId={editSkillId}
        skillTitle={editSkillTitle}
        handleSubmit={handleSubmit}
      />
    </React.Fragment>
  );
};

export default ListCareerPath;
import React, { useContext, useEffect } from 'react';
import { IoCheckmarkSharp } from "react-icons/io5";
import './index.scss';
import { useParams } from 'react-router-dom';
import Loading from '../../Components/Loading';
import useFetch from 'point-fetch-react';
import AddSkills from '../../Components/DashboardComponents/DataGrid/AddSkills';
import EditSkills from '../../Components/DashboardComponents/DataGrid/EditSkills';
import { AiTwotoneDelete } from "react-icons/ai";
import { AiTwotoneEdit } from "react-icons/ai";
import { baseURL } from '../../Utils/contants';
import { MdOutlineClose } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import { BiSolidSend } from "react-icons/bi";
import MapContext from '../../context/MapContext';

const ListCareerPath = () => {
  const [selectedId, setSelectedId] = React.useState(null);
  const [listData, setListData] = React.useState([]);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [getGPTResponse, setGetGPTResponse] = React.useState([]);
  const [file, setFile] = React.useState(null); 
  const [message, setMessage] = React.useState(""); 


  const params = useParams();
  const { get, destroy, Processing } = useFetch({ state: {} });
  const { getTitle } = useContext(MapContext);


  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editSkillId, setEditSkillId] = React.useState(null);
  const [editSkillTitle, setEditSkillTitle] = React.useState("");
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedPathId, setSelectedPathId] = React.useState(null);


  useEffect(() => {
    setSelectedPathId(params.id);
  }, [])
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
        setListData(res?.data?.data?.skills || []);
      }
    });
  };

  const handleUpdateSkills = (id) => {
    get({
      endPoint: `/check-status-of-skills/${id}`,
      onSuccess: (res) => {
        if (res?.data?.status === "completed") {
          setSelectedId(id);
        } else {
          setSelectedId(null);
        }
        handleSubmit();
      }
    })
  };


  const handleDelete = (id) => {
    destroy({
      endPoint: `/delete-skill/${id}`,
      onSuccess: (res) => {
        handleSubmit();
      },
      onError: (err) => {
        Snackbar(err.error, { variant: "error" });
      },
    });
  };

  useEffect(() => {
    handleSubmit();
  }, []);


// for gpt section 

  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleSendMessage = async () => {
   try{
    if (!message && !file) {
      alert("Please enter a message or upload a file!");
      return;
    }

    setIsSending(true);
    const token = localStorage.getItem("user-visited-dashboard");
    const formData = new FormData();
    
    if (message) {
      formData.append("message", message);
    }
    
    if (file) {
      formData.append("file", file);
    }
    
    formData.append("step_id", selectedPathId);

      const response = await fetch(`${baseURL}/send-message`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const resData = await response.json();
        handleGetMessage(selectedPathId);
        setMessage(""); 
        setFile(null); 
        console.log(resData);
      }else{
        alert(response?.statusText);
      }
      setIsSending(false);

   }catch(err){
    console.log(err);
    setIsSending(false);

   }
   
  };

  const handleGetMessage = (stepId) => {
    get({
      endPoint: `/get-message/${stepId}`,
      onSuccess: (res) => {
        setGetGPTResponse(res?.data?.data);
      }
    });
  };

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <React.Fragment>
      {Processing ? <Loading processing={Processing} /> : null}
      


      {/* gpt section  */}
      <main className="gpt-section">

      {/* left skills section  */}
      <div className="list-section">
        <div className="main__heading">
          <div>
            <p style={{ fontSize: "13px" }}>{getTitle}</p>
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
      </div>
      
      {/* right gpt section  */}
      <div className={`gpt-section__right ${isMinimized ? "minimized" : ""}`}>
        <div className="gpt-section__heading">
          <div>
            {/* <img src="/images/gpt.png" alt="gpt" />
            <h2>Chat GPT</h2> */}
           <img src="/images/career-chat.png" alt="gpt" style={{width:'130px', height:'32px'}}/>

          </div>

          <div className="gpt-section__close" onClick={handleToggle}>
            {isMinimized ? (
              <IoIosArrowDown style={{ fontSize: "20px" }} />
            ) : (
              <MdOutlineClose style={{ fontSize: "20px" }} />
            )}
          </div>
        </div>

        {!isMinimized && (
        <div className="gpt-section__content" style={{overflowY: "auto"}}>
        <div className="content__inner" style={{overflowY: "visible"}}>
          <div style={{ overflowY: "scroll",  height: "78%", padding: "12px 5px" }}>
            {getGPTResponse?.length > 0 &&
              getGPTResponse.map((item, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      backgroundColor: "#f5f6fa",
                      padding: "10px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#5B708B",
                      width: "60%",
                    }}
                  >
                    <span>{item.prompt}</span>
                  </div>
                  <p
                    style={{
                      background: "#E8E8E8",
                      padding: "10px",
                      fontSize: "11px",
                      width: "80%",
                    }}
                  >
                    {item.result}
                  </p>
                </div>
              ))}

            {isSending && (
                    <div style={{textAlign: "center"}}>Generating response...</div>
                  )}
                        {/* <div className="innder-right__txt">
                          <img src="/images/clear.png" alt="clear" />
                          New dialog
                        </div> */}
                      </div>
                  
                      <div
                        className="search__box"
                        style={{
                          boxShadow:
                            "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {/* Preview Section */}
                          {file && (
                          <div style={{ marginRight: "10px", position: "relative", display: "inline-block" }}>
                            {file.type === "application/pdf" ? (
                              // PDF ke liye
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#f4f4f4",
                                  border: "1px solid #ddd",
                                  borderRadius: "5px",
                                }}
                              >
                                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>PDF</span>
                              </div>
                            ) : (
                              // Images ke liye
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "5px",
                                  objectFit: "cover",
                                  border: "1px solid #ddd",
                                }}
                              />
                            )}
                            {/* Cross Icon */}
                            <button
                              onClick={() => setFile(null)}
                              style={{
                                position: "absolute",
                                top: "-5px",
                                right: "-5px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        )}

                  
                          {/* Upload Input */}
                          <label className="upload-label" style={{ marginRight: "10px" }}>
                            <GrAttachment style={{ fontSize: "16px" }} />
                            <input
                              type="file"
                              name="file"
                              style={{ display: "none" }}
                              onChange={handleFileUpload}
                            />
                          </label>
                  
                          {/* Message Input */}
                          <input
                            type="text"
                            placeholder="Ask Me"
                            name="message"
                            value={message}
                            onChange={handleInputChange}
                            style={{ flex: 1 }}
                          />
                  
                          {/* Send Button */}
                          <button
                            onClick={handleSendMessage}
                            style={{
                              cursor: "pointer",
                            }}
                            disabled={isSending}
                          >
                            <BiSolidSend
                              style={{
                                fontSize: "16px",
                                color: isSending ? "#cccccc" : "#000000",
                                backgroundColor: "--var(--primary-btn-color)",
                              }}
                            />
                          </button>
                        </div>
                        {/* {Errors.message && <p className="error">{Errors.message}</p>} */}
                      </div>
                    </div>
                  </div>
                  
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
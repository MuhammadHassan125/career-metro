import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapContext from "../../../context/MapContext";
import { MdOutlineClose } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import useFetch from "point-fetch-react";
import { BiSolidSend } from "react-icons/bi";
import { baseURL } from "../../../Utils/contants";


const GPTComponent = ({ selectedPathId }) => {
  // const navigate = useNavigate();
  // const [isMinimized, setIsMinimized] = useState(false);
  // const [isSending, setIsSending] = useState(false);
  // const [getGPTResponse, setGetGPTResponse] = useState([]);
  // const { gettingSkillsData, getTitle, getDescription } = useContext(MapContext);
  // const skillsId = localStorage.getItem("singlePathId");

  // const { post, get, Data, setData, Errors, validate } = useFetch({
  //   state: {
  //     message: "",
  //     step_id: null,
  //   },
  //   rules: {
  //     message: ["required"],
  //   },
  //   message: {
  //     message: {
  //       required: "Message field is required*",
  //     },
  //   },
  // });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setData(name, value);
  // };

  // useEffect(() => {
  //   setData({ step_id: selectedPathId, message: "" });
  // }, [selectedPathId]);

  // const handleSendMessage = () => {
  //   setIsSending(true);
  //   post({
  //     endPoint: `/send-message`,
  //     onSuccess: (res) => {
  //       handleGetMessage(selectedPathId);
  //       setData("message", "");
  //       setIsSending(false);
  //     },
  //     onError: (err) => {
  //       setIsSending(false);
  //     },
  //   });
  // };

  // const handleGetMessage = (stepId) => {
  //   get({
  //     endPoint: `/get-message/${stepId}`,
  //     onSuccess: (res) => {
  //       setGetGPTResponse(res?.data?.data);
  //     }
  //   });
  // };

  // const handleToggle = () => {
  //   setIsMinimized(!isMinimized);
  // };

  // const handleFileUpload = () => {

  // }

  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [getGPTResponse, setGetGPTResponse] = useState([]);
  const { gettingSkillsData, getTitle, getDescription } = useContext(MapContext);
  const skillsId = localStorage.getItem("singlePathId");
  const [file, setFile] = useState(null); 
  const [message, setMessage] = useState(""); 

  const {get} = useFetch({state:{}});

  useEffect(() => {
    setMessage(""); 
    setFile(null); 
  }, [selectedPathId]);

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
    <main className="gpt-section">
      {/* left sales executive  */}
      <div className="gpt-section__left">
        <h5>Key Skills</h5>
        <h2 style={{ color: 'var(--primary-btn-color)', fontSize: '10px' }}>{getTitle}</h2>

        <div className="gpt-section__skills-div">
          {Array.isArray(gettingSkillsData) && gettingSkillsData.length > 0 ? (
            gettingSkillsData.map((skills, i) => (
              <button key={i} style={{ color: 'var(--primary-btn-color)' }}>{skills.title}</button>
            ))
          ) : (
            <p>No details available</p>
          )}
        </div>
        <p>{getDescription}</p>

        <div className="gpt-section__btn-div">
          <div>
            <button
              className="gpt-section__btn"
              style={{ backgroundColor: '#1572e9', color: 'white' }}
              onClick={() => navigate(`/list-career-path/${skillsId}`)}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* right gpt section  */}
      <div className={`gpt-section__right ${isMinimized ? "minimized" : ""}`}>
        <div className="gpt-section__heading">
          <div>
            <img src="/images/career-chat.png" alt="gpt" style={{width:'150px', height:'40px'}}/>
            {/* <h2>Chat GPT</h2> */}
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
        <div className="gpt-section__content">
        <div className="content__inner">
          <div style={{ overflowY: "auto", height: "66%", padding: "12px 5px" }}>
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
              );
            };

export default GPTComponent;
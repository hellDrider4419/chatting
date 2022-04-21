import moment from "moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  addNewMessage,
  deleteMessage,
  setSelectedRoom,
} from "../reactRedux/initialSlice";
import useChat from "./useChat";
import documentThumbnail from "../../images/docThumb.png";
import plusIcon from "../../images/plus.png";
import { serverUrl } from "../../config";

function ChatArea(props) {
  const { message, deleteMessage, sendDeleteRequest, sendMessage } = useChat(
    props.roomDetails.roomid
  );
  const [fieldMsg, setfieldMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [roomUSerInfo, setRoomUserInfo] = useState();
  const [menuDetails, setMenuDetails] = useState({});
  const [replyMessage, setReplyMessage] = useState();
  const [chatroomHeight, setChatroomHeight] = useState();
  useEffect(() => {
    message &&
      props.addNewMessage({ message, roomid: props.roomDetails.roomid });
  }, [message, props]);
  useEffect(
    () =>
      setChatroomHeight(
        (document.getElementById("reply-msg")
          ? document.getElementById("reply-msg").offsetHeight
          : 0) +
          (document.getElementById("chat-header")
            ? document.getElementById("chat-header").offsetHeight
            : 0) +
          (document.getElementById("text-area")
            ? document.getElementById("text-area").offsetHeight
            : 0) +
          20
      ),
    [props, fieldMsg, selectedFile, roomUSerInfo, menuDetails, replyMessage]
  );

  useEffect(() => {
    deleteMessage && props.deleteMessage(deleteMessage);
  }, [deleteMessage, props]);

  useEffect(() => {
    replyMessage && console.log(replyMessage);
  }, [replyMessage]);

  useEffect(() => {
    if (props.roomDetails?.userlist?.length === 2) {
      props.userList.forEach((e) => {
        if (
          e.userid === props.roomDetails.userlist[0] ||
          e.userid === props.roomDetails.userlist[1]
        ) {
          setRoomUserInfo(e);
        }
      });
    }
  }, [props.userList, props.roomDetails]);
  const handleHidePopup = () => {
    setMenuDetails({});
  };

  const handleSendMessage = () => {
    if ((fieldMsg && fieldMsg.length) || selectedFile) {
      let files = [];
      for (let i = 0; i < selectedFile?.length; i++) {
        files.push({ file: selectedFile[i], name: selectedFile[i].name });
      }
      sendMessage({
        msg: fieldMsg,
        time: moment().format(),
        userid: props.userInfo.userid,
        roomid: props.roomDetails.roomid,
        file: files,
        parent_msgid: replyMessage?.msgid ? replyMessage.msgid : null,
      });
      setSelectedFile("");
      setfieldMsg("");
      setReplyMessage();
    }
  };
  useEffect(() => {
    if (props.selectedRoom === props.roomDetails.roomid) {
      document.getElementById(
        `chat-body-${props.roomDetails.roomid}`
      ).scrollTop = document.getElementById(
        `chat-body-${props.roomDetails.roomid}`
      ).scrollHeight;
    }
  }, [props.selectedRoom]);

  const displaySelectedImages = () => {
    let images = [];
    for (let i = 0; i < selectedFile.length; i++) {
      images.push(
        <img
          className={"reply-files"}
          src={window.URL.createObjectURL(selectedFile[i])}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = documentThumbnail;
          }}
          alt="media"
        />
      );
    }
    return images;
  };
  return (
    <>
      <div
        className="chatArea"
        style={{
          display:
            props.selectedRoom === props.roomDetails.roomid &&
            props.selectedRoom !== -1
              ? "block"
              : "none",
        }}
      >
        <div className="chat-header displayFlexCenter" id="chat-header">
          <div
            className="person-profile"
            style={{
              backgroundImage: `url(${serverUrl}/images/${roomUSerInfo?.pofileimage})`,
            }}
          ></div>
          <div className="person-profile-info">
            <div className="person-profile-name">
              {props.roomDetails.name}
              <div className="person-profile-des">
                {roomUSerInfo?.description}
              </div>
            </div>
            {/* <div className="person-profile-last-seen">
              last active : 10:30 pm
            </div> */}
          </div>
          <div className="person-profile-menu">
            <i className="fa menu-icon fa-ellipsis-v" aria-hidden="true"></i>
          </div>
        </div>
        <div
          className="chat-body"
          id={`chat-body-${props.roomDetails.roomid}`}
          style={{
            height: `calc(100% - ${chatroomHeight}px)`,
          }}
          onClick={() => {
            handleHidePopup();
          }}
          onScroll={() => {
            handleHidePopup();
          }}
        >
          <div className="initial-msg">stay secure with encryped messaging</div>
          {menuDetails.showMenu && <Menu {...menuDetails} />}
          {props.roomDetails?.messages?.map((msg, i) => {
            if (msg?.message?.length || msg?.images?.length) {
              return (
                <>
                  {(i === 0 ||
                    moment(props?.roomDetails?.messages[i - 1].time).format(
                      "dddd DD MMMM YYYY"
                    )) !==
                    moment(props?.roomDetails?.messages[i].time).format(
                      "dddd DD MMMM YYYY"
                    ) && (
                    <div className="msg-date">
                      {moment(msg.time).format("dddd DD MMMM YYYY")}
                    </div>
                  )}
                  <div
                    className={
                      props.userInfo.userid === msg.userid
                        ? "msg-sent"
                        : "msg-recieved"
                    }
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenuDetails({
                        top:
                          e.clientY + 69 > window.innerHeight
                            ? e.clientY - 69
                            : e.clientY,
                        left:
                          e.clientX + 160 > window.innerWidth
                            ? e.clientX - 160
                            : e.clientX,
                        showMenu: true,
                        deleteBtn: props.userInfo.userid === msg.userid,
                        sendDeleteRequest:
                          props.userInfo.userid === msg.userid
                            ? () => {
                                sendDeleteRequest({
                                  msgid: msg.msgid,
                                  roomid: props.roomDetails.roomid,
                                });
                              }
                            : null,
                        copyOnCLick: () => {
                          navigator.clipboard.writeText(msg.message);
                        },
                        ReplyOnClick: () => {
                          setReplyMessage(msg);
                        },
                      });
                    }}
                  >
                    {msg.parent_msgid &&
                      props.roomDetails?.messages?.map((replyMsg, i) =>
                        replyMsg.msgid === msg.parent_msgid ? (
                          <div className="tagmsg-inner-container">
                            {replyMsg?.images?.slice(0, 2)?.map((e) => (
                              <img
                                className={"tagmsg-files"}
                                src={`${serverUrl}/images/${e}`}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = documentThumbnail;
                                }}
                                alt="media"
                              />
                            ))}
                            <div
                              style={{
                                marginLeft: 10,
                                marginRight: 10,
                                width: "-webkit-fill-available",
                              }}
                            >
                              {replyMsg?.message}
                            </div>
                            <div className="msg-time">
                              {moment(replyMsg.time).format("hh:mm")}
                            </div>
                          </div>
                        ) : null
                      )}
                    <div className="filesContainer">
                      {msg?.images?.slice(0, 4)?.map((e) => (
                        <img
                          className={
                            msg?.images?.length === 1
                              ? "files"
                              : "multiplefiles"
                          }
                          src={`${serverUrl}/images/${e}`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = documentThumbnail;
                          }}
                          alt="media"
                        />
                      ))}
                    </div>
                    {msg.message}
                    <div className="msg-time">
                      {moment(msg.time).format("hh:mm")}
                    </div>
                  </div>
                </>
              );
            }
          })}
        </div>
        {(replyMessage || selectedFile) && (
          <div className="reply-msg" id="reply-msg">
            {selectedFile && (
              <div className="selectedFile-inner-container">
                {displaySelectedImages()}
              </div>
            )}
            {replyMessage && (
              <div className="reply-inner-container">
                {replyMessage?.images?.slice(0, 2)?.map((e) => (
                  <img
                    className={"reply-files"}
                    src={`${serverUrl}/images/${e}`}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = documentThumbnail;
                    }}
                    alt="media"
                  />
                ))}
                <div style={{ marginLeft: 10, marginRight: "auto" }}>
                  {replyMessage.message}
                </div>
                <div className="msg-time">
                  {moment(replyMessage.time).format("hh:mm")}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="type-area">
          <label htmlFor="fileInput">
            <i
              className="fa fa-superpowers other-option"
              aria-hidden="true"
            ></i>
          </label>
          <input
            onClick={(e) => (e.target.value = "")}
            multiple
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            accept="media_type"
            onChange={(e) => {
              selectedFile.length
                ? setSelectedFile([...selectedFile, ...e.target.files])
                : setSelectedFile(e.target.files);
            }}
          ></input>

          <div className="text-area" id="text-area">
            <input
              type="text"
              placeholder="type message here"
              value={fieldMsg}
              className="msg-to-type"
              onKeyDown={(e) => {
                e.keyCode === 13 && handleSendMessage();
              }}
              onChange={(e) => {
                setfieldMsg(e.target.value);
              }}
            ></input>
            <i
              className="fa fa-arrow-circle-right send-icon"
              aria-hidden="true"
              onClick={handleSendMessage}
            ></i>
          </div>

          <div className="other-option-popup"></div>
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedRoom: (data) => {
      dispatch(setSelectedRoom(data));
    },
    addNewMessage: (data) => {
      dispatch(addNewMessage(data));
    },
    deleteMessage: (data) => {
      dispatch(deleteMessage(data));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    selectedRoom: state.initialSlice.selectedRoom,
    userInfo: state.initialSlice.userInfo,
    userList: state.initialSlice.userList,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatArea);

function Menu(props) {
  return (
    <div
      id="menu"
      style={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "#272727",
        borderRadius: 5,
        boxShadow: "0 2px 8px 5px #111111",
        padding: "3px 5px",
        minWidth: 150,
        top: props.top,
        left: props.left,
        zIndex: 1,
        flexDirection: "column",
      }}
    >
      {props.deleteBtn && (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "5px 0px",
            // borderBottom: "1px solid grey",
          }}
          onClick={() => {
            props.sendDeleteRequest();
          }}
        >
          delete
        </div>
      )}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "5px 0px",
          // borderBottom: "1px solid grey",
        }}
        onClick={() => {
          props.copyOnCLick();
        }}
      >
        copy text
      </div>
      <div
        style={{ width: "100%", textAlign: "center", padding: "5px 0px" }}
        onClick={() => {
          props.ReplyOnClick();
        }}
      >
        reply
      </div>
    </div>
  );
}

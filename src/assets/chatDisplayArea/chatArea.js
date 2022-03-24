import moment from "moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addNewMessage, setSelectedRoom } from "../reactRedux/initialSlice";
import useChat from "./useChat";
import ScrollToBottom from "react-scroll-to-bottom";
import { uploadImage } from "../../apiCalls/chatApiCall";

function ChatArea(props) {
  const { message, sendMessage } = useChat(props.roomDetails.roomid);
  const [fieldMsg, setfieldMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  useEffect(() => {
    message &&
      props.addNewMessage({ message, roomid: props.roomDetails.roomid });
  }, [message]);

  const handleSendMessage = () => {
    const data = new FormData();

    for (let i = 0; i < selectedFile.length; i++) {
      data.append("file", selectedFile[i]);
    }
    uploadImage(data);
    if (fieldMsg && fieldMsg.length) {
      sendMessage({
        msg: fieldMsg,
        time: moment().format(),
        userid: props.userInfo.userid,
        type: "text",
        roomid: props.roomDetails.roomid,
      });

      setfieldMsg("");
    }
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
        <div className="chat-header displayFlexCenter">
          <div className="person-profile"></div>
          <div className="person-profile-info">
            <div className="person-profile-name">
              {props.roomDetails.name}
              <div className="person-profile-des">description of he thing</div>
            </div>
            <div className="person-profile-last-seen">
              last active : 10:30 pm
            </div>
          </div>
          <div className="person-profile-menu">
            <i className="fa menu-icon fa-ellipsis-v" aria-hidden="true"></i>
          </div>
        </div>
        <div className="chat-body">
          <div className="initial-msg">stay secure with encryped messaging</div>
          {console.log(props.roomDetails?.messages)}
          {props.roomDetails?.messages?.map((msg, i) => {
            if (msg?.message?.length) {
              return (
                <>
                  {(i == 0 ||
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
                  >
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
        <div className="type-area">
          <label for="fileInput">
            <i
              className="fa fa-superpowers other-option"
              aria-hidden="true"
            ></i>
          </label>
          <input
            multiple
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            accept="media_type"
            onChange={(e) => {
              setSelectedFile(e.target.files);
            }}
          ></input>

          <div className="text-area">
            <input
              type="text"
              placeholder="type message here"
              value={fieldMsg}
              className="msg-to-type"
              onKeyDown={(e) => {
                e.keyCode === 13 && handleSendMessage();
              }}
              onChange={(e) => setfieldMsg(e.target.value)}
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
  };
};

const mapStateToProps = (state) => {
  return {
    selectedRoom: state.initialSlice.selectedRoom,
    userInfo: state.initialSlice.userInfo,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatArea);

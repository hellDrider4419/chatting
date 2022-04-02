import moment from "moment";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addNewMessage, setSelectedRoom } from "../reactRedux/initialSlice";
import useChat from "./useChat";
import documentThumbnail from "../../images/docThumb.png";
import { serverUrl } from "../../config";

function ChatArea(props) {
  const { message, sendMessage } = useChat(props.roomDetails.roomid);
  const [fieldMsg, setfieldMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [roomUSerInfo, setRoomUserInfo] = useState();
  useEffect(() => {
    message &&
      props.addNewMessage({ message, roomid: props.roomDetails.roomid });
  }, [message]);

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
      });
      setSelectedFile("");
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
        <div className="chat-body">
          <div className="initial-msg">stay secure with encryped messaging</div>
          {props.roomDetails?.messages?.map((msg, i) => {
            if (msg?.message?.length || msg?.images?.length) {
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
                    onContextMenu={(e) => {
                      e.preventDefault();
                      // console.log("Right click", {
                      //   x: e.nativeEvent.offsetX,
                      //   y: e.nativeEvent.offsetY,
                      // });
                    }}
                  >
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
                        />
                      ))}
                    </div>
                    {msg.message}
                    <div className="msg-time">
                      {moment(msg.time).format("hh:mm")}
                    </div>
                    {/* <Menu /> */}
                  </div>
                </>
              );
            }
          })}
        </div>
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
    userList: state.initialSlice.userList,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatArea);

function Menu(props) {
  return (
    <div>
      <div>delete</div>
    </div>
  );
}

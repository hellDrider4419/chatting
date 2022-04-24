import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setSelectedRoom, setDeleteRoom } from "../reactRedux/initialSlice";
import moment from "moment";
import { serverUrl } from "../../config";
import { deleteRoom } from "../../apiCalls/chatApiCall";

class ChatRoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuDetails: {},
    };
  }
  getUserName(roomUserList) {
    let name = "";
    this.props.userList.forEach((user) => {
      if (roomUserList.includes(user.userid)) name = user.name;
    });
    return name;
  }

  extractRoomProfile(room) {
    let image = null;
    if (room.userlist.length === 2) {
      if (room.userlist[0] !== this.props.userInfo.userid) {
        this.props.userList.forEach((e) => {
          if (!image && e.userid === room.userlist[0]) {
            image = e.pofileimage;
          }
        });
      } else {
        this.props.userList.forEach((e) => {
          if (!image && e.userid === room.userlist[1]) {
            image = e.pofileimage;
          }
        });
      }
    }
    return `${serverUrl}/images/${image}`;
  }

  render() {
    return (
      <>
        <div
          className="recent-contact"
          onClick={() =>
            this.setState({
              menuDetails: {},
            })
          }
        >
          {/* single chat box */}
          {this.props.roomList
            ?.filter((e) => e.showroom.includes(this.props.userInfo.userid))
            .map((item, i) => {
              return (
                <div
                  className="contact-container dir_Row displayFlexCenter"
                  onClick={() => {
                    this.props.setSelectedRoom(item.roomid);
                  }}
                  style={
                    this.props.selectedRoom === item.roomid
                      ? { backgroundColor: "#9f929233" }
                      : {}
                  }
                >
                  <div
                    className="contact-profile"
                    style={{
                      backgroundImage: `url(${this.extractRoomProfile(item)})`,
                    }}
                  >
                    <div className="contact-status"></div>
                  </div>
                  <div className="contact-details">
                    <div className="contact-menu dir_Row displayFlexCenter">
                      <div className="contact-name">
                        {item.name !== ""
                          ? item.name
                          : this.getUserName(item.userlist)}
                      </div>
                      {this.state.menuDetails.showMenu && (
                        <Menu {...this.state.menuDetails} />
                      )}
                      <div className="contact-time-menu">
                        <i
                          className="fa menu-icon fa-ellipsis-v"
                          aria-hidden="true"
                          style={{
                            width: 20,
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            this.setState({
                              menuDetails: {
                                top:
                                  e.clientY + 69 > window.innerHeight
                                    ? e.clientY - 69
                                    : e.clientY,
                                left:
                                  e.clientX + 160 > window.innerWidth
                                    ? e.clientX - 160
                                    : e.clientX,
                                showMenu: true,
                                sendDeleteRequest: () => {
                                  deleteRoom({
                                    roomid: item.roomid,
                                    userid: this.props.userInfo.userid,
                                  });
                                  this.props.setDeleteRoom({
                                    roomid: item.roomid,
                                    userid: this.props.userInfo.userid,
                                  });
                                  this.setState({
                                    menuDetails: {},
                                  });
                                },
                              },
                            });
                          }}
                        ></i>
                      </div>
                    </div>
                    <div className="contact-msg dir_Row displayFlexCenter">
                      <i
                        className={`fa fa-${
                          item?.messages?.length &&
                          item?.messages[item?.messages?.length - 1].images
                            .length
                            ? "image"
                            : "commenting"
                        } msg-icon`}
                        aria-hidden="true"
                      ></i>
                      {item?.messages?.length &&
                      item?.messages[item?.messages?.length - 1].message
                        ? item?.messages[item?.messages?.length - 1].message
                        : "media"}
                      <div
                        className="contact-time-menu"
                        style={{ marginLeft: "auto" }}
                      >
                        {item?.messages?.length &&
                          moment(
                            item?.messages[item?.messages?.length - 1].time
                          ).format("HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div
          className="recent-contact-footer"
          onClick={() =>
            this.setState({
              menuDetails: {},
            })
          }
        >
          stay connected, stay happy ...
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedRoom: (data) => {
      dispatch(setSelectedRoom(data));
    },
    setDeleteRoom: (data) => {
      dispatch(setDeleteRoom(data));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    roomList: state.initialSlice.roomList,
    userList: state.initialSlice.userList,
    selectedRoom: state.initialSlice.selectedRoom,
    userInfo: state.initialSlice.userInfo,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomList);

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
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setSelectedRoom } from "../reactRedux/initialSlice";
import moment from "moment";

class ChatRoomList extends React.Component {
  constructor(props) {
    super(props);
  }
  getUserName(roomUserList) {
    let name = "";
    this.props.userList.forEach((user) => {
      if (roomUserList.includes(user.userid)) name = user.name;
    });
    return name;
  }

  render() {
    return (
      <div className="recent-contact">
        {/* single chat box */}
        {this.props.roomList.map((item, i) => {
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
              <div className="contact-profile">
                <div className="contact-status"></div>
              </div>
              <div className="contact-details">
                <div className="contact-menu dir_Row displayFlexCenter">
                  <div className="contact-name">
                    {item.name !== ""
                      ? item.name
                      : this.getUserName(item.userlist)}
                  </div>
                  <div className="contact-time-menu">
                    <i
                      className="fa menu-icon fa-ellipsis-v"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
                {/* <div className="contact-msg dir_Row displayFlexCenter">
                  <i
                    className="fa fa-commenting msg-icon"
                    aria-hidden="true"
                  ></i>
                  {item?.messages[item.messages?.length - 1].message}
                  <div
                    className="contact-time-menu"
                    style={{ marginLeft: "auto" }}
                  >
                    {moment(
                      item?.messages[item.messages?.length - 1].time
                    ).format("HH:MM")}
                  </div>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedRoom: (data) => {
      dispatch(setSelectedRoom(data));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    roomList: state.initialSlice.roomList,
    userList: state.initialSlice.userList,
    selectedRoom: state.initialSlice.selectedRoom,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomList);

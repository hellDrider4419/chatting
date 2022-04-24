import React from "react";
import ChatRoomList from "./chatRoomList";
import ChatArea from "./chatArea";
import ContactList from "./contactList";
import {
  getUserDetails,
  getUserList,
  getUserRoomList,
} from "../../apiCalls/chatApiCall";
import { withRouter } from "../../withRouter";
import history from "../../history";
import { connect } from "react-redux";
import {
  setRoomList,
  setUserInfo,
  setUserList,
} from "../reactRedux/initialSlice";
import { serverUrl } from "../../config";

class ChatDisplayArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "recent",
    };
    this.tabList = [
      { name: "recent" },
      { name: "add new chat" },
      { name: "create group" },
    ];
    this.getUserDetails();
  }

  getUserDetails = async () => {
    if (!localStorage.getItem("loginToken")) {
      this.props.navigate("/");
    }
    const userInfo = await getUserDetails({
      userid: localStorage.getItem("loginToken"),
    });
    if (userInfo.email) {
      this.props.setUserInfo(userInfo);
    } else {
      localStorage.removeItem("loginToken");
      history.push("/");
      this.props.navigate("/");
    }

    const userList = await getUserList({});
    this.props.setUserList(userList);

    const roomList = await getUserRoomList({
      userid: localStorage.getItem("loginToken"),
    });
    this.props.setRoomList(roomList);
  };

  handleTabSelection = (name) => {
    this.setState({
      selectedTab: name,
    });
  };

  render() {
    return (
      <div className="main wh_100 displayFlexCenter">
        <div className="contactArea">
          <div className="contact-header dir_Row displayFlexCenter">
            <div
              className="profile-img"
              style={{
                backgroundImage: `url(${serverUrl}/images/${this.props.userInfo.pofileimage})`,
              }}
            ></div>
            <div className="profile-info">
              <div className="info-name">{this.props.userInfo.name}</div>
              <div className="info-des">{this.props.userInfo.description}</div>
            </div>
          </div>
          <div className="contact-search dir_Row displayFlexCenter">
            <div
              className="search-bar"
              type="text"
              placeholder="enter to search"
            >
              search text
            </div>
            <i className="fa fa-search" aria-hidden="true"></i>
            <div className="search-result"></div>
          </div>
          <div className="contact-tab">
            {this.tabList.map((item) => (
              <div
                className={`tabs ${
                  this.state.selectedTab === item.name ? "selected-tab" : ""
                }`}
                key={item.name}
                onClick={() => {
                  this.handleTabSelection(item.name);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
          {this.state.selectedTab === this.tabList[0].name && <ChatRoomList />}
          {this.state.selectedTab === this.tabList[1].name && (
            <ContactList handleTabSelection={this.handleTabSelection} />
          )}
          {this.state.selectedTab === this.tabList[2].name && <ContactList />}
        </div>
        {
          <div
            className="chatArea"
            style={{
              display: this.props.selectedRoom === -1 ? "block" : "none",
            }}
          >
            <div className="chat-header displayFlexCenter">
              <div className="person-profile"></div>
              <div className="person-profile-info">
                <div className="person-profile-name">
                  <div className="person-profile-des">
                    description of he thing
                  </div>
                </div>
              </div>
              <div className="person-profile-menu">
                <i
                  className="fa menu-icon fa-ellipsis-v"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
            <div className="chat-body">
              <div className="initial-msg">Start messaging </div>
            </div>
          </div>
        }
        {this.props.roomList.map((item) => (
          <ChatArea roomDetails={item} />
        ))}
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (data) => {
      dispatch(setUserInfo(data));
    },
    setUserList: (data) => {
      dispatch(setUserList(data));
    },
    setRoomList: (data) => {
      dispatch(setRoomList(data));
    },
  };
};
const mapStateToProps = (state) => {
  return {
    userInfo: state.initialSlice.userInfo,
    roomList: state.initialSlice.roomList,
    selectedRoom: state.initialSlice.selectedRoom,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChatDisplayArea));

import React from "react";
import { connect } from "react-redux";
import { createNewRoom, getUserList } from "../../apiCalls/chatApiCall";
import { serverUrl } from "../../config";
import { addRoom, setSelectedRoom } from "../reactRedux/initialSlice";
import profilepic from "./../../images/profilepic.png";

class ContactList extends React.Component {
  constructor(props) {
    super(props);
  }

  handleCreateRoom = async (item) => {
    let alreadyPresent = false;
    const result = await createNewRoom({
      userList: [item.userid, this.props.userInfo.userid],
      roomName: "",
    });
    this.props.addRoom(result);
    this.props.handleTabSelection("recent");
    this.props.setSelectedRoom(result.roomid);
  };

  handleNoImage = (item) => {
    try {
      return (
        <div
          className="contact-profile hw25"
          style={{
            backgroundImage: `url(${serverUrl}/images/${item.pofileimage})`,
          }}
        ></div>
      );
    } catch (err) {
      return (
        <div
          className="contact-profile hw25"
          style={{
            backgroundImage: `url(${window.URL.createObjectURL(profilepic)})`,
          }}
        ></div>
      );
    }
  };

  render() {
    return (
      <>
        <div className="recent-contact">
          {this.props.userList.map((item) => (
            <div
              className="contact-container displayFlexCenter h40"
              onClick={() => this.handleCreateRoom(item)}
            >
              {this.handleNoImage(item)}
              <div className="contact-details">
                <div className="contact-menu displayFlexCenter">
                  <div className="contact-name">{item.name}</div>
                </div>
                <div className="contact-msg displayFlexCenter"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="recent-contact-footer">
          stay connected, stay happy ...
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addRoom: (data) => {
      dispatch(addRoom(data));
    },
    setSelectedRoom: (data) => {
      dispatch(setSelectedRoom(data));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.initialSlice.userInfo,
    userList: state.initialSlice.userList,
    roomList: state.initialSlice.roomList,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ContactList);

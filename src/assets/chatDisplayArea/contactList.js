import React from "react";
import { connect } from "react-redux";
import { createNewRoom, getUserList } from "../../apiCalls/chatApiCall";
import { addRoom, setSelectedRoom } from "../reactRedux/initialSlice";

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

  render() {
    return (
      <>
        <div className="recent-contact">
          {this.props.userList.map((item) => (
            <div
              className="contact-container displayFlexCenter h40"
              onClick={() => this.handleCreateRoom(item)}
            >
              <div className="contact-profile hw25"></div>
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

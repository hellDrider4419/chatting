import React from "react";
import { connect } from "react-redux";
import { createNewRoom, getUserList } from "../../apiCalls/chatApiCall";
import { addRoom } from "../reactRedux/initialSlice";

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
    this.props.roomList.map((rooms) => {
      if (rooms.roomid === result.roomid) {
        alreadyPresent = true;
      }
    });
    if (!alreadyPresent) {
      this.props.addRoom(result);
    }
  };

  render() {
    return (
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
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addRoom: (data) => {
      dispatch(addRoom(data));
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

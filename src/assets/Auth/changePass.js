import React from "react";
import { registerUser } from "../../apiCalls/authApiCalls";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      old_password: "",
      new_password: "",
      confirm_password: "",
    };
  }
  //   handleOnSave = () => {
  //     let { name, email, password, confirm_password } = this.state;
  //     if (
  //       name.length &&
  //       email.length &&
  //       password.length &&
  //       confirm_password.length &&
  //       password === confirm_password
  //     ) {
  //       registerUser({ name, password, email });
  //     }
  //   };

  render() {
    return (
      <div className="login">
        <div className="login-popup">
          <div className="form">
            <h1>Change Password</h1>
            <input
              className="input"
              onChange={(e) => {
                this.setState({ old_password: e.target.value });
              }}
              value={this.state.old_password}
              placeholder="old password"
              type="password"
            ></input>
            <input
              className="input"
              onChange={(e) => {
                this.setState({ new_password: e.target.value });
              }}
              value={this.state.new_password}
              placeholder="new password"
              type="password"
            ></input>
            <input
              className="input"
              onChange={(e) => {
                this.setState({ confirm_password: e.target.value });
              }}
              value={this.state.confirm_password}
              placeholder="confirm password"
              type="password"
            ></input>
            <button className="signup-button">save</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePassword;

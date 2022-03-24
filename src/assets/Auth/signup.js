import React from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../apiCalls/authApiCalls";
import history from "../../history";
import { withRouter } from "../../withRouter";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    };
  }

  handleOnSignUp = async () => {
    let { name, email, password, confirm_password } = this.state;
    if (
      name.length &&
      email.length &&
      password.length &&
      confirm_password.length &&
      password === confirm_password
    ) {
      const result = await registerUser({ name, password, email });
      if (result.userid) {
        localStorage.setItem("loginToken", result.userid);
        history.push("/addDetails");
        this.props.navigate("/addDetails");
      }
    }
  };

  render() {
    return (
      <div className="login">
        <div className="login-popup">
          <div className="form">
            <h1>Create Account</h1>
            <p className="login-des">please enter details to sign up</p>

            <input
              className="input"
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
              value={this.state.name}
              placeholder="name"
            ></input>
            <input
              className="input"
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}
              value={this.state.email}
              placeholder="email@email.com"
            ></input>
            <input
              className="input"
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
              value={this.state.password}
              placeholder="password"
              type="password"
            ></input>
            <input
              className="input"
              onChange={(e) => {
                this.setState({ confirm_password: e.target.value });
              }}
              value={this.state.confirm_password}
              placeholder="re-enter password"
              type="password"
            ></input>
            <button className="signup-button" onClick={this.handleOnSignUp}>
              sign up
            </button>
            <Link to="/login" className="signupRoutes">
              Already have Account?
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUp);

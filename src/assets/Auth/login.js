import React from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../apiCalls/authApiCalls";
import history from "../../history";
import { withRouter } from "../../withRouter";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  handleOnSignIn = async () => {
    let { email, password } = this.state;
    if (email.length && password.length) {
      const result = await loginUser({ password, email });
      if (result.userid) {
        localStorage.setItem("loginToken", result.userid);
        history.push("/home");
        this.props.navigate("/home");
      }
    }
  };

  render() {
    return (
      <div className="login">
        <div className="login-popup">
          <div className="form">
            <h1>Log in to your account</h1>
            <p className="login-des">please enter details to log in</p>
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
            <button onClick={this.handleOnSignIn} className="signup-button">
              Sign in
            </button>
            <Link to="/" className="signupRoutes">
              Dont't have Account? Create New
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);

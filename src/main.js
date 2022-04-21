import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

import AddDetails from "./assets/Auth/addDetails";
import ChangePassword from "./assets/Auth/changePass";
import Login from "./assets/Auth/login";
import SignUp from "./assets/Auth/signup";
import ChatDisplayArea from "./assets/chatDisplayArea/chatDisplayArea";
import history from "./history";

function Main(props) {
  return (
    <React.Fragment>
      <Router history={history}>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addDetails" element={<AddDetails />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/home" element={<ChatDisplayArea />} />
        </Routes>
      </Router>
      <div className="snackbar" id="snackbar">
        {props.snackbar}
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    snackbar: state.initialSlice.snackbar,
  };
};

export default connect(mapStateToProps, null)(Main);

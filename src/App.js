import React, { useEffect } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.scss";

import AddDetails from "./assets/Auth/addDetails";
import ChangePassword from "./assets/Auth/changePass";
import Login from "./assets/Auth/login";
import SignUp from "./assets/Auth/signup";
import ChatDisplayArea from "./assets/chatDisplayArea/chatDisplayArea";
import store from "./assets/reactRedux/store";
import history from "./history";

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addDetails" element={<AddDetails />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/home" element={<ChatDisplayArea />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

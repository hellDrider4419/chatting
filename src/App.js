import React from "react";
import { Provider } from "react-redux";
import "./App.scss";
import store from "./assets/reactRedux/store";
import Main from "./main";

function App(props) {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

export default App;

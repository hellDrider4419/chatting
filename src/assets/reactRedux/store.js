import { configureStore } from "@reduxjs/toolkit";
import initialSlice from "./initialSlice";

export default configureStore({
  reducer: {
    initialSlice,
  },
});

import { createSlice } from "@reduxjs/toolkit";

export const initialSlice = createSlice({
  name: "initialSlice",
  initialState: {
    userInfo: {},
    userList: [],
    roomList: [],
    selectedRoom: -1,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload.filter(
        (e) => e.userid !== state.userInfo.userid
      );
    },
    setRoomList: (state, action) => {
      console.log(action.payload);
      state.roomList = action.payload;
    },
    addRoom: (state, action) => {
      state.roomList = [...state.roomList, action.payload];
    },
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },
    addNewMessage: (state, action) => {
      if (action.payload?.message?.msgid) {
        let roomDetails = {},
          index;
        state.roomList.forEach((room, pos) => {
          if (room.roomid === action.payload.roomid) {
            roomDetails = room;
            index = pos;
          }
        });
        if (
          !state.roomList[index]?.messages?.filter(
            (e) => e.msdid === action.payload.message.msgid
          ).length
        ) {
          state.roomList[index] = {
            ...roomDetails,
            messages: roomDetails?.messages
              ? [...roomDetails?.messages, action.payload.message]
              : [action.payload.message],
          };
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRoomList,
  setUserInfo,
  setUserList,
  setSelectedRoom,
  addRoom,
  addNewMessage,
} = initialSlice.actions;

export default initialSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
const CryptoJS = require("crypto-js");

export const initialSlice = createSlice({
  name: "initialSlice",
  initialState: {
    userInfo: {},
    userList: [],
    roomList: [],
    selectedRoom: -1,
    snackbar: "",
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setSnackbar: (state, action) => {
      var element = document.getElementById("snackbar");
      element.classList.remove("snackAnim");
      void element.offsetWidth;
      state.snackbar = action.payload;
      element.classList.add("snackAnim");
    },
    setUserList: (state, action) => {
      state.userList = action.payload.filter(
        (e) => e.userid !== state.userInfo.userid
      );
    },
    setRoomList: (state, action) => {
      let roomdata = action.payload?.map((room) => ({
        ...room,
        messages: room?.messages?.map((msg) => {
          var bytes = CryptoJS.AES.decrypt(msg?.message, "mynameisire");
          var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          return {
            ...msg,
            message: decryptedData,
          };
        }),
      }));
      state.roomList = roomdata;
    },
    addRoom: (state, action) => {
      let roomDetails = {},
        index;
      state.roomList.forEach((room, pos) => {
        if (room.roomid === action.payload.roomid) {
          roomDetails = room;
          index = pos;
        }
      });
      if (index || index === 0) {
        state.roomList[index] = {
          ...state.roomList[index],
          ...action.payload,
        };
      } else {
        state.roomList = [...state.roomList, action.payload];
      }
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
            (e) => e.msgid === action.payload.message.msgid
          ).length
        ) {
          state.roomList[index] = {
            ...roomDetails,
            showroom: roomDetails?.showroom?.includes(action.payload.userid)
              ? roomDetails.showroom
              : [...roomDetails.showroom, action.payload.userid],
            messages: roomDetails?.messages
              ? [...roomDetails?.messages, action.payload.message]
              : [action.payload.message],
          };
          if (action.payload.userid !== action.payload.message.userid) {
            var element = document.getElementById("snackbar");
            element.classList.remove("snackAnim");
            void element.offsetWidth;
            state.snackbar = "new message recieved";
            element.classList.add("snackAnim");
          }
        }
      }
    },
    deleteMessage: (state, action) => {
      let roomDetails = {},
        index;
      state.roomList.forEach((room, pos) => {
        if (room.roomid === action.payload.roomid) {
          roomDetails = room;
          index = pos;
        }
      });
      if (
        state.roomList[index]?.messages?.filter(
          (e) => e.msgid === action.payload.msgid
        ).length
      ) {
        state.roomList[index] = {
          ...roomDetails,
          messages: roomDetails?.messages.filter(
            (e) => e.msgid !== action.payload.msgid
          ),
        };
      }
    },
    setDeleteRoom: (state, action) => {
      let roomDetails = {},
        index;
      state.roomList.forEach((room, pos) => {
        if (room.roomid === action.payload.roomid) {
          roomDetails = room;
          index = pos;
        }
      });
      state.roomList[index] = {
        ...roomDetails,
        showroom: roomDetails.showroom.filter(
          (e) => e != action.payload.userid
        ),
        messages: [],
      };
      if (state.selectedRoom === action.payload.roomid) {
        state.selectedRoom = -1;
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
  deleteMessage,
  setSnackbar,
  setDeleteRoom,
} = initialSlice.actions;

export default initialSlice.reducer;

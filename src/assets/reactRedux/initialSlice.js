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
      console.log("log");
      element.classList.add("snackAnim");
      // document.getAnimations().forEach((anim) => {
      //   anim.cancel();
      //   anim.play();
      // });
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
            (e) => e.msgid === action.payload.message.msgid
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
} = initialSlice.actions;

export default initialSlice.reducer;

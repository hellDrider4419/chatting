import axios from "axios";
const serverUrl = "http://localhost:4000";

export const getUserList = async () => {
  const result = await axios.get(`${serverUrl}/getAllUserList`);
  return result.data;
};

export const getUserDetails = async (args) => {
  const result = await axios.post(`${serverUrl}/getUserDetails`, args);
  return result.data;
};

export const getUserRoomList = async (args) => {
  const result = await axios.post(`${serverUrl}/getUserRoomList`, args);
  return result.data;
};

export const createNewRoom = async (args) => {
  const result = await axios.post(`${serverUrl}/createNewRoom`, args);
  return result.data;
};

export const uploadImage = async (args) => {
  const result = await axios.post(`${serverUrl}/uploadImage`, args);
  return result.data;
};

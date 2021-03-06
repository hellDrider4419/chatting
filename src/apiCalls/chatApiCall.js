import axios from "axios";
import { serverUrl } from "../config";

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

export const updateAbout = async (args) => {
  const result = await axios.post(`${serverUrl}/updateAbout`, args);
  return result.data;
};
export const deleteRoom = async (args) => {
  const result = await axios.post(`${serverUrl}/deleteRoom`, args);
  return result.data;
};

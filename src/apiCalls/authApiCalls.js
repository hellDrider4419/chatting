import axios from "axios";
const serverUrl = "http://localhost:4000";

export const registerUser = async (args) => {
  const result = await axios.post(`${serverUrl}/addNewUser`, args);
  return result.data;
};
export const loginUser = async (args) => {
  const result = await axios.post(`${serverUrl}/loginUser`, args);
  return result.data;
};

export const createNewRoom = async (args) => {
  const result = await axios.post(`${serverUrl}/createNewRoom`, args);
  return result.data;
};

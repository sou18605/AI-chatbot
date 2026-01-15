import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const loginAPI = (data) =>
  axios.post(`${API}/login`, data);

export const registerAPI = (data) =>
  axios.post(`${API}/register`, data);

export const googleLogin = () => {
  window.location.href = `${API}/google`;
};

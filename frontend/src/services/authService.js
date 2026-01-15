import axios from "axios";

const API = "https://ai-chatbot-8-2hi4.onrender.com/api/auth";

export const loginAPI = (data) =>
  axios.post(`${API}/login`, data);

export const registerAPI = (data) =>
  axios.post(`${API}/register`, data);

export const googleLogin = () => {
  window.location.href = `${API}/google`;
};

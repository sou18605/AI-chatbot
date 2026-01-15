import axios from "axios";

<<<<<<< HEAD
const API = "https://ai-chatbot-8-2hi4.onrender.com/api/auth";
=======
const API = "http://localhost:5000/api/auth";
>>>>>>> 36d918a (changes)

export const loginAPI = (data) =>
  axios.post(`${API}/login`, data);

export const registerAPI = (data) =>
  axios.post(`${API}/register`, data);

export const googleLogin = () => {
  window.location.href = `${API}/google`;
};

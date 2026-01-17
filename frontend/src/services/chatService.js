import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-chatbot-10-5xb3.onrender.com/api",
});

export const fetchSessionsAPI = () => API.get("/chat/sessions");

export const fetchHistoryAPI = (sessionId) =>
  API.get(`/chat/history/${sessionId}`);

export const sendMessageAPI = (message, sessionId) =>
  API.post("/chat/send", { message, sessionId });

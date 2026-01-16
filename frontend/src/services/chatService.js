import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const fetchSessionsAPI = () => API.get("/chat/sessions");

export const fetchHistoryAPI = (sessionId) =>
  API.get(`/chat/history/${sessionId}`);

export const sendMessageAPI = (message, sessionId) =>
  API.post("/chat/send", { message, sessionId });

import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-chatbot-6kdx.onrender.com/api",
});

// 🔐 Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// 🔁 Auto logout on token expiry
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("chat-session");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const fetchSessionsAPI = () =>
  API.get("/chat/sessions");

export const fetchHistoryAPI = (sessionId) =>
  API.get(`/chat/history/${sessionId}`);

export const sendMessageAPI = (message, sessionId) =>
  API.post("/chat", { message, sessionId });

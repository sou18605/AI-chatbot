import axios from "axios";

const API_BASE = "https://ai-chatbot-6kdx.onrender.com/api/chat";

export const fetchSessionsAPI = () =>
  axios.get(`${API_BASE}/sessions`);

export const fetchHistoryAPI = sessionId =>
  axios.get(`${API_BASE}/history/${sessionId}`);

export const sendMessageAPI = (message, sessionId) =>
  axios.post(API_BASE, { message, sessionId });

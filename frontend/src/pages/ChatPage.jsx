import { useEffect, useRef, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import useTheme from "../hooks/useTheme";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import "../App.css"
import {
  fetchSessionsAPI,
  fetchHistoryAPI,
  sendMessageAPI
} from "../services/chatService";

export default function ChatPage({ setIsAuth }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const chatEndRef = useRef(null);
  const { darkMode, toggleTheme } = useTheme();
  const { listening, toggleMic } = useSpeechRecognition(setMessage);

  /* ================= SESSION INIT ================= */
  useEffect(() => {
    let s = localStorage.getItem("chat-session");
    if (!s) {
      s = "session-" + Date.now();
      localStorage.setItem("chat-session", s);
    }
    setSessionId(s);
  }, []);

  /* ================= FETCH SESSIONS ================= */
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetchSessionsAPI();
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  /* ================= FETCH CHAT HISTORY ================= */
  useEffect(() => {
    if (!sessionId || isInitialized) return;

    fetchHistoryAPI(sessionId).then(res => {
      const history = [];
      res.data.history?.forEach(item => {
        history.push({ role: "user", text: item.userMessage });
        history.push({ role: "assistant", text: item.botReply });
      });
      setChat(history);
      setIsInitialized(true);
    });
  }, [sessionId, isInitialized]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat(prev => [...prev, { role: "user", text: message }]);
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const res = await sendMessageAPI(currentMessage, sessionId);
      const aiText = res.data.reply;

      setChat(prev => [...prev, { role: "assistant", text: aiText }]);
      fetchSessions();
    } catch (err) {
      setChat(prev => [
        ...prev,
        { role: "assistant", text: "Error generating response." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* ================= NEW CHAT ================= */
  const createNewChat = () => {
    const id = "session-" + Date.now();
    localStorage.setItem("chat-session", id);
    setSessionId(id);
    setChat([]);
    setIsInitialized(true);
  };

  /* ================= SWITCH CHAT ================= */
  const switchSession = id => {
    localStorage.setItem("chat-session", id);
    setSessionId(id);
    setChat([]);
    setIsInitialized(false);
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Sidebar
        sessions={sessions}
        sessionId={sessionId}
        fetchSessions={fetchSessions}
        createNewChat={createNewChat}
        switchSession={switchSession}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
      />

      <ChatContainer
        chat={chat}
        loading={loading}
        chatEndRef={chatEndRef}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        listening={listening}
        toggleMic={toggleMic}
        setIsAuth={setIsAuth} // pass down logout handler
      />
    </div>
  );
}

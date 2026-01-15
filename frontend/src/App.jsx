import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const chatEndRef = useRef(null);

  const { darkMode, toggleTheme } = useTheme();
  const { listening, toggleMic } = useSpeechRecognition(setMessage);

  /* ================= GOOGLE LOGIN REDIRECT ================= */
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

  return (
    <div className="app">
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
      />
    </div>
  );
}

export default App;

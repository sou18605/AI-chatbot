import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";
import 'boxicons';

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [darkMode, setDarkMode] = useState(true); // theme state

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  /* =========================
     THEME TOGGLE
  ========================= */
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  /* =========================
     SESSION INIT
  ========================= */
  useEffect(() => {
    let savedSession = localStorage.getItem("chat-session");
    if (!savedSession) {
      savedSession = "session-" + Date.now();
      localStorage.setItem("chat-session", savedSession);
    }
    setSessionId(savedSession);
  }, []);

  /* =========================
     FETCH SESSIONS
  ========================= */
  const fetchSessions = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chat/sessions");
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error("Sessions fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  /* =========================
     FETCH CHAT HISTORY
  ========================= */
  useEffect(() => {
    if (!sessionId || isInitialized) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/history/${sessionId}`
        );

        if (!res.data.history || res.data.history.length === 0) {
          setChat([]);
          return;
        }

        const formattedChat = [];

        res.data.history.forEach(item => {
          formattedChat.push({ role: "user", text: item.userMessage });
          formattedChat.push({ role: "assistant", text: item.botReply });
        });

        setChat(formattedChat);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchHistory();
  }, [sessionId, isInitialized]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = async () => {
    if (!message.trim() || !sessionId) return;

    const userMsg = { role: "user", text: message };
    setChat(prev => [...prev, userMsg]);

    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: currentMessage,
        sessionId
      });

      const botMsg = { role: "assistant", text: res.data.reply };
      setChat(prev => [...prev, botMsg]);

      fetchSessions();

      // Text to speech
      const utter = new SpeechSynthesisUtterance(res.data.reply);
      speechSynthesis.speak(utter);
    } catch (err) {
      setChat(prev => [
        { role: "assistant", text: "Error: " + (err.response?.data?.error || err.message) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* =========================
     SPEECH RECOGNITION
  ========================= */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = e => {
      setMessage(e.results[0][0].transcript);
    };

    recognitionRef.current.onend = () => setListening(false);
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    listening ? recognitionRef.current.stop() : recognitionRef.current.start();
    setListening(!listening);
  };

  /* =========================
     NEW CHAT
  ========================= */
  const createNewChat = () => {
    const newSessionId = "session-" + Date.now();
    localStorage.setItem("chat-session", newSessionId);
    setSessionId(newSessionId);
    setChat([]);
    setIsInitialized(true);
  };

  /* =========================
     SWITCH CHAT
  ========================= */
  const switchSession = newSessionId => {
    localStorage.setItem("chat-session", newSessionId);
    setSessionId(newSessionId);
    setChat([]);
    setIsInitialized(false);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button onClick={fetchSessions}>
            <i className="bx bx-refresh"></i>
          </button>
          <button onClick={createNewChat}>
            <i className="bx bx-plus"></i>
          </button>
          <button onClick={toggleTheme}>
            {darkMode ? <i className="bx bx-sun"></i> : <i className="bx bx-moon"></i>}
          </button>
        </div>

        <ul>
          {sessions.length === 0 ? (
            <li className="no-chats">No chats yet</li>
          ) : (
            sessions.map(s => (
              <li
                key={s.sessionId}
                className={s.sessionId === sessionId ? "active" : ""}
                onClick={() => switchSession(s.sessionId)}
                title={s.title}
              >
                {s.title || s.sessionId.substring(0, 20)}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* CHAT AREA */}
      <div className="chat-container">
        <div className="chat-header">NEXA AI</div>

        <div className="chat-body">
          {chat.length === 0 ? (
            <div className="empty-chat">Start a new conversation</div>
          ) : (
            chat.map((msg, i) => (
              <div key={i} className={`message ${msg.role === "user" ? "user" : "bot"}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            ))
          )}

          {loading && (
            <div className="message bot">
              Typing <i className="bx bx-loader-alt bx-spin"></i>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          />

          <button onClick={handleMicClick}>
            {listening ? <i className="bx bx-stop"></i> : <i className="bx bx-microphone"></i>}
          </button>

          <button onClick={sendMessage} disabled={loading || !message.trim()}>
            {loading ? <i className="bx bx-loader bx-spin"></i> : <i className="bx bx-send"></i>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

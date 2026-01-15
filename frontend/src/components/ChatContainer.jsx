import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChatContainer({
  chat,
  loading,
  chatEndRef,
  message,
  setMessage,
  sendMessage,
  listening,
  toggleMic,
  setIsAuth // received from ChatPage
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "https://ai-chatbot-8-2hi4.onrender.com/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log(err);
    }

    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("chat-session");

    // Update App auth state
    setIsAuth(false);

    // Redirect to login page
    navigate("/login", { replace: true }); // prevents back navigation
  };

  return (
    <div className="chat-container">
      <div
        className="chat-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>NEXA AI</span>
        <button
          onClick={handleLogout}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            background: "#f44336",
            color: "white"
          }}
        >
          Logout
        </button>
      </div>

      <ChatBody chat={chat} loading={loading} chatEndRef={chatEndRef} />

      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        loading={loading}
        listening={listening}
        toggleMic={toggleMic}
      />
    </div>
  );
}

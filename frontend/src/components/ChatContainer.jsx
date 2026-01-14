import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";

export default function ChatContainer({
  chat,
  loading,
  chatEndRef,
  message,
  setMessage,
  sendMessage,
  listening,
  toggleMic
}) {
  return (
    <div className="chat-container">
      <div className="chat-header">NEXA AI</div>

      <ChatBody
        chat={chat}
        loading={loading}
        chatEndRef={chatEndRef}
      />

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

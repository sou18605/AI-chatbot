export default function ChatInput({
  message,
  setMessage,
  sendMessage,
  loading,
  listening,
  toggleMic
}) {
  return (
    <div className="chat-input">
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={e =>
          e.key === "Enter" && !e.shiftKey && sendMessage()
        }
      />

      <button onClick={toggleMic}>
        {listening ? (
          <i className="bx bx-stop"></i>
        ) : (
          <i className="bx bx-microphone"></i>
        )}
      </button>

      <button onClick={sendMessage} disabled={loading || !message.trim()}>
        {loading ? (
          <i className="bx bx-loader bx-spin"></i>
        ) : (
          <i className="bx bx-send"></i>
        )}
      </button>
    </div>
  );
}

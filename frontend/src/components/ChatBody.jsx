import Message from "./Message";

export default function ChatBody({ chat, loading, chatEndRef }) {
  return (
    <div className="chat-body">
      {chat.length === 0 ? (
        <div className="empty-chat">Start a new conversation</div>
      ) : (
        chat.map((msg, i) => (
          <Message key={i} role={msg.role} text={msg.text} />
        ))
      )}

      {loading && (
        <div className="message bot">
          Typing <i className="bx bx-loader-alt bx-spin"></i>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}

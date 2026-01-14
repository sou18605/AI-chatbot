export default function Sidebar({
  sessions,
  sessionId,
  fetchSessions,
  createNewChat,
  switchSession,
  toggleTheme,
  darkMode
}) {
  return (
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
          {darkMode ? (
            <i className="bx bx-sun"></i>
          ) : (
            <i className="bx bx-moon"></i>
          )}
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
            >
              {s.title || s.sessionId.substring(0, 20)}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

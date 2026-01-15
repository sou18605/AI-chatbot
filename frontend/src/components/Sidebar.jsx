import React from "react";

/**
 * Sidebar Component
 * -----------------
 * Mobile friendly
 * Hamburger compatible
 * No backend / logic changes required
 */

export default function Sidebar({
  sessions,
  sessionId,
  fetchSessions,
  createNewChat,
  switchSession,
  toggleTheme,
  darkMode,
  isOpen,
  closeSidebar
}) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      
      {/* ===============================
          HEADER
      =============================== */}
      <div className="sidebar-header">
        <h2>Chats</h2>

        <div style={{ display: "flex", gap: "6px" }}>


          <button onClick={createNewChat} title="New Chat">
            <i className="bx bx-plus"></i>
          </button>

          <button onClick={toggleTheme} title="Toggle Theme">
            {darkMode ? (
              <i className="bx bx-sun"></i>
            ) : (
              <i className="bx bx-moon"></i>
            )}
          </button>

          {/* Mobile Close */}
        </div>
      </div>

      {/* ===============================
          CHAT LIST
      =============================== */}
      <ul>
        {sessions.length === 0 ? (
          <li className="no-chats">No chats yet</li>
        ) : (
          sessions.map((s) => (
            <li
              key={s.sessionId}
              className={s.sessionId === sessionId ? "active" : ""}
              onClick={() => {
                switchSession(s.sessionId);
                closeSidebar?.(); // auto-close on mobile
              }}
            >
              {s.title || `Chat ${s.sessionId.slice(0, 8)}`}
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}

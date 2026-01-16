import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/chat" />} />

      {/* Chat Page */}
      <Route path="/chat" element={<ChatPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/chat" />} />
    </Routes>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";

function App() {
  // Get token from URL (Google OAuth redirect)
  const getTokenFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  const initialToken = localStorage.getItem("token") || getTokenFromURL();
  const [isAuth, setIsAuth] = useState(!!initialToken);

  /* ================= GOOGLE LOGIN REDIRECT ================= */
  useEffect(() => {
    const token = getTokenFromURL();
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
      setIsAuth(true);
    }
  }, []);

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={isAuth ? <Navigate to="/chat" /> : <Navigate to="/login" />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={!isAuth ? <Register /> : <Navigate to="/chat" />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={!isAuth ? <Login onLogin={() => setIsAuth(true)} /> : <Navigate to="/chat" />}
      />

      {/* Chat Page */}
      <Route
        path="/chat"
        element={isAuth ? <ChatPage setIsAuth={setIsAuth} /> : <Navigate to="/login" />}
      />

      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to={isAuth ? "/chat" : "/login"} />}
      />
    </Routes>
  );
}

export default App;

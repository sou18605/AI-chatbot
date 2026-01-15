import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";

function App() {
  // Check if token exists in URL query
  const getTokenFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  const [isAuth, setIsAuth] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Wait until auth is checked

  useEffect(() => {
    const token = localStorage.getItem("token") || getTokenFromURL();

    if (token) {
      localStorage.setItem("token", token);
      setIsAuth(true);
    }

    // Clean URL regardless of token presence
    window.history.replaceState({}, document.title, "/");
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>; // Show loading while checking token
  }

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={isAuth ? <Navigate to="/chat" /> : <Navigate to="/register" />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          !isAuth ? <Register onRegistered={() => setIsAuth(true)} /> : <Navigate to="/chat" />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          !isAuth ? <Login onLogin={() => setIsAuth(true)} /> : <Navigate to="/chat" />
        }
      />

      {/* Chat Page */}
      <Route
        path="/chat"
        element={isAuth ? <ChatPage setIsAuth={setIsAuth} /> : <Navigate to="/login" />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={isAuth ? "/chat" : "/register"} />} />
    </Routes>
  );
}

export default App;

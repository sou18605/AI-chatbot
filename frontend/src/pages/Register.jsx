import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Shared CSS for Login/Register

<<<<<<< HEAD
export default function Register() {
=======
export default function Register({ onRegistered }) {
>>>>>>> 36d918a (changes)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD

=======
>>>>>>> 36d918a (changes)
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful! Please login.");
      navigate("/login", { replace: true });

=======
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });

      // Optional success message
      alert("Registration successful! Redirecting to login...");

      // Trigger callback (if needed)
      onRegistered?.();

      // Navigate to login page
      navigate("/login", { replace: true });
>>>>>>> 36d918a (changes)
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
<<<<<<< HEAD

=======
>>>>>>> 36d918a (changes)
        <form onSubmit={handleRegister} className="register-form">
          <input
            className="register-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
<<<<<<< HEAD

=======
>>>>>>> 36d918a (changes)
          <input
            className="register-input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
<<<<<<< HEAD

=======
>>>>>>> 36d918a (changes)
          <input
            className="register-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
<<<<<<< HEAD

=======
>>>>>>> 36d918a (changes)
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
<<<<<<< HEAD

=======
>>>>>>> 36d918a (changes)
        <p className="register-login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

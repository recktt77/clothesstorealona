import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, isAdmin } from "../../api";

const Login = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await loginUser({ identifier: email, password });
      if (!response || !response.user) {
        console.log("Invalid response from server");
        throw new Error("Invalid response from server");
      }

      const { user } = response;
      const adminStatus = await isAdmin(email);
      console.log(user);
      console.log("Login successful:", user.Email, "Admin:", adminStatus);

      localStorage.setItem("token", "user-token");
      localStorage.setItem("isAdmin", adminStatus ? "true" : "false");
      localStorage.setItem("userEmail", user.Email);

      onSubmit(user.Email, adminStatus);

      navigate("/", { replace: true });

    } catch (error) {
      setMessage(error.message || "Login failed");
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label="Password"
        />
        <br />
        <button className="buttonWight" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

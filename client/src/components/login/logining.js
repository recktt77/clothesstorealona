import React, { useState } from "react";
import { loginUser, isAdmin } from "../../api";

const Login = ({ onSubmit, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    try {
      const response = await loginUser({ identifier: email, password });
      if (!response || !response.user) {
        throw new Error("Invalid response from server");
      }
      const { user } = response;

      const adminStatus = await isAdmin(email);
      
      onSubmit(user.email, adminStatus);
      setMessage("Login successful");
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
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label="Password"
        />
        <br />
        <button className="buttonWight" type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="#" onClick={onSwitch}>Register</a>
      </p>
    </div>
  );
};

export default Login;

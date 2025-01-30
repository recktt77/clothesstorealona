// src/components/Login.js
import React, { Component } from "react";
import { loginUser } from "../../api";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      message: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({
        email: this.state.email,
        password: this.state.password,
      });
      this.setState({ message: "enetred succesfuly" });
    } catch (error) {
      this.setState({ message: error || "error" });
    }
    this.props.onSubmit(this.state.email);
  };

  render() {
    return (
      <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h2>Login</h2>
        {this.state.message && <p style={{ color: "red" }}>{this.state.message}</p>}
        <form onSubmit={this.handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required /><br />
          <input type="password" name="password" placeholder="password" onChange={this.handleChange} required /><br />
          <button type="submit" >login</button>
        </form>
        <p>
          do you have an account? <a href="#" onClick={this.props.onSwitch}>Register</a>
        </p>
      </div>
    );
  }
}

export default Login;

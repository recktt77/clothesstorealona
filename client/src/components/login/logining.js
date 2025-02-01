import React, { Component } from "react";
import { loginUser, isAdmin } from "../../api";

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
      const { user } = await loginUser({
        email: this.state.email,
        password: this.state.password,
      });

      const adminStatus = await isAdmin(this.state.email);

      this.props.onSubmit(user.email, adminStatus);
      this.setState({ message: "Login successful" });
    } catch (error) {
      this.setState({ message: error.message || "Login failed" });
    }
  };

  render() {
    return (
      <div className="form">
        <h2>Login</h2>
        {this.state.message && <p style={{ color: "red" }}>{this.state.message}</p>}
        <form onSubmit={this.handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required /><br />
          <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required /><br />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="#" onClick={this.props.onSwitch}>Register</a>
        </p>
      </div>
    );
  }
}

export default Login;

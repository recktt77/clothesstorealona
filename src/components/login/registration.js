import React, { Component } from "react";
import { registerUser } from "../../api";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      number: "",
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
      await registerUser({
        email: this.state.email,
        number: this.state.number,
        password: this.state.password,
      });
      this.setState({ message: "suuccessfuly" });
    } catch (error) {
      this.setState({ message: error || "error" });
    }
  };

  render() {
    return (
      <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h2>Registration</h2>
        {this.state.message && <p style={{ color: "red" }}>{this.state.message}</p>}
        <form onSubmit={this.handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required /><br />
          <input type="text" name="number" placeholder="Phone number" onChange={this.handleChange} required /><br />
          <input type="password" name="password" placeholder="password" onChange={this.handleChange} required /><br />
          <button type="submit">Register</button>
        </form>
        <p>
          Have you alreafy registered <a href="#" onClick={this.props.onSwitch}>Enter</a>
        </p>
      </div>
    );
  }
}

export default Register;

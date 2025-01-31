import React from "react";
import Register from "../login/registration";
import Login from "../login/logining";

class LogReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showRegister: true,
          email: "",
        };
        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
      }
    
      toggleForm = () => {
        this.setState({ showRegister: !this.state.showRegister });
      };

      handleEmailSubmit(email, isAdmin) {
        if (this.props.onSubmit) {
            this.props.onSubmit(email, isAdmin);
        }
    }
    
    
      render() {
        return (
          <div className="LogReg">
            {this.state.showRegister ? (
              <Register onSwitch={this.toggleForm} />
            ) : (
              <Login onSwitch={this.toggleForm} onSubmit={this.handleEmailSubmit}/>
            )}
          </div>
        );
      }
}

export default LogReg;
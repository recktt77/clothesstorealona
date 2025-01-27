import React from "react";
import Login from "./login";
import Register from "./register";

class LogReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggle: false,
            email: "",
        };

        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
        this.handleChange= this.handleChange.bind(this)
    }
    handleChange(){
        this.setState({isToggle: !this.state.isToggle})
    }
    handleEmailSubmit(email) {
        if (this.props.onSubmit) {
            this.props.onSubmit(email);
        }
    }

    render() {
        return (
            <div className="LogReg">
                {!this.state.isToggle ?
                (<Login onSubmit={this.handleEmailSubmit} onClick={this.handleChange}/>)
                :
                (<Register onSubmit={this.handleEmailSubmit} onClick={this.handleChange}/>)}
            </div>
        );
    }
}

export default LogReg;
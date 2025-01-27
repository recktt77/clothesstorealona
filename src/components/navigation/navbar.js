import React from "react";
import Navigation from "./nuv";
import Button from "./button";
import LogReg from "../login/LogReg"
class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogReg: false,
            userEmail: "",
        };

        this.handleJoinUsClick = this.handleJoinUsClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleJoinUsClick() {
        this.setState({ showLogReg: true });
    }

    handleFormSubmit(email) {
        this.setState({
            showLogReg: false,
            userEmail: email,
        });
    }

    render() {
        return (
            <div className="navbar">
                <p>ALONA</p>
                <Navigation />
                {this.state.showLogReg ? (
                    <LogReg onSubmit={(email) => this.handleFormSubmit(email)}/>
                ) : this.state.userEmail ? (
                    <p>{this.state.userEmail}</p>
                ) : (
                    <Button buttoname="join us" onClick={this.handleJoinUsClick} />
                )}
            </div>
        );
    }
}

export default NavBar;
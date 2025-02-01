import React from "react";
import Navigation from "./nuv";
import Button from "./button";
import LogReg from "../login/LogReg";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogReg: false,
            userEmail: "",
            isAdmin: false,
        };

        this.handleJoinUsClick = this.handleJoinUsClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleJoinUsClick() {
        this.setState({ showLogReg: true });
    }

    handleFormSubmit(email, isAdmin) {
        this.setState({
            showLogReg: false,
            userEmail: email,
            isAdmin: isAdmin, 
        });
    }

    render() {
        return (
            <div className="navbar">
                <p>ALONA</p>
                <Navigation isAdmin={this.state.isAdmin} />
                {this.state.showLogReg ? (
                    <LogReg onSubmit={(email, isAdmin) => this.handleFormSubmit(email, isAdmin)}/>
                ) : this.state.userEmail ? (
                    <>
                        <p>{this.state.userEmail}</p>
                    </>
                ) : (
                    <Button buttoname="Join us" onClick={this.handleJoinUsClick} />
                )}
            </div>
        );
    }
}

export default NavBar;

import React from "react";
import Navigation from "./nuv";
import Button from "./button";
import LogReg from "../login/LogReg";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogReg: false,
        };

        this.handleJoinUsClick = this.handleJoinUsClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    }

    handleJoinUsClick() {
        this.setState({ showLogReg: !this.state.showLogReg });
    }

    handleLoginSuccess(email, isAdmin) {
        this.setState({ showLogReg: false });
        this.props.onSubmit(email, isAdmin);
    }

    handleLogoutClick() {
        if (this.props.onLogout) {
            this.props.onLogout();
        }
        if (this.props.clearBasket) {
            this.props.clearBasket();
        }
        if (this.props.clearPosts) {
            this.props.clearPosts();
        }
    }
    

    render() {
        return (
            <div className="navbar">
                <p>ALONA</p>
                <Navigation isAdmin={this.props.isAdmin} />
                
                {this.state.showLogReg ? ( 
                    <LogReg onSubmit={this.handleLoginSuccess} switching={this.handleJoinUsClick} />
                ) : this.props.userEmail ? (
                    <div className="loggedIn">
                        <p>{this.props.userEmail}</p>
                        <Button buttoname="Logout" onClick={this.handleLogoutClick} />
                    </div>
                ) : (
                    <Button buttoname="Join us" onClick={this.handleJoinUsClick} />
                )}
            </div>
        );
    }
}

export default NavBar;

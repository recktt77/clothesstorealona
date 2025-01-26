import React from "react";
import Navigation from "./nuv";
import Button from "./button";
class NavBar extends React.Component {
    render() {
        return (
            <div className="navbar">
                <p>ALONA</p>
                <Navigation />
                <Button buttoname='join us' />
            </div>
        )
    }
}

export default NavBar
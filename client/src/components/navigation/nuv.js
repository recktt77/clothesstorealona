import React from "react";
import { Link } from "react-router-dom";

class Navigation extends React.Component {
    render() {
        return (
            <div className="nav">
                {!this.props.isAdmin ? (
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/post">Post</Link>
                        <Link to="/ownpage">Ownpage</Link>
                    </nav>
                ) : (
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/post">Post</Link>
                        <Link to="/ownpage">Ownpage</Link>
                        <Link to="/admin">Admin</Link>
                    </nav>
                )}
            </div>
        );
    }
}

export default Navigation;

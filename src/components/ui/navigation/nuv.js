import { div } from "framer-motion/client";
import React from "react";

class Navigation extends React.Component{
    render() {
        return(
            <div className="nav">
                <a href="#">Main Page</a>
                <a href="#">Shop</a>
                <a href="#">Something</a>
            </div>
        )
    }
}

export default Navigation
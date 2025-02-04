import React from "react";

class Button extends React.Component {
    render() {
        return (
            <button className="buttonWight" onClick={this.props.onClick}>
                {this.props.buttoname}
            </button>
        );
    }
}

export default Button;

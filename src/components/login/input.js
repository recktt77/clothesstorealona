import React from "react";

class Input extends React.Component {
    render() {
        return (
            <div className="inputForm">
                <label htmlFor={this.props.inputName}>{this.props.inputName}</label>
                <input
                    type={this.props.inputType}
                    id={this.props.inputName}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

export default Input
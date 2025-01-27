import React from "react";
import FormReg from "./formReg";

class Register extends React.Component {
    render() {
        return (
            <div className="register">
                <FormReg onSubmit={this.props.onSubmit} onClick={this.props.onClick}/>
            </div>
        );
    }
}
export default Register
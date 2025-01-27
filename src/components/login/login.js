import React from "react";
import Form from "./form"


class Login extends React.Component {
    render() {
        return (
            <div className="login">
                <Form onSubmit={this.props.onSubmit} onClick={this.props.onClick}/>
            </div>
        );
    }
}

export default Login
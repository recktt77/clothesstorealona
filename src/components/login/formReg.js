import React from "react";
import Input from "./input";
import Button from "../navigation/button";

class FormReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleInputChange(event) {
        this.setState({ email: event.target.value });
    }

    handleFormSubmit(event) {
        event.preventDefault();
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.email);
        }
    }

    render() {
        return (
            <div className="form">
                <form onSubmit={this.handleFormSubmit}>
                    <Input
                        inputType="text"
                        inputName="Email"
                        onChange={this.handleInputChange}
                    />
                     <Input
                    inputType= "password"
                    inputName= "Password"
                    />
                    <Button buttoname="submit"/>

                    <a onClick={this.props.onClick}>go to Register</a>
                </form>
            </div>
        );
    }
}

export default FormReg;
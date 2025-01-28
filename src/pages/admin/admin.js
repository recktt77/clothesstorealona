import React from "react";
import "./admin.css";

class Admin extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            users: []
        }

        // this.handleUpdate= this.handleUpdate.bind(this)
        // this.handleDelete= this.handleDelete.bind(this)
    }

    // handleUpdate(id){

    // }

    // handleDelete(){

    // }
  render(){
    return (
      <div className="Admin">
                {!this.state.users.length>0 ? 
                (<div>NO user</div>)
                :
                (<div>{this.state.users}</div>)
            }
      </div>
    );
  }
}
export default Admin;

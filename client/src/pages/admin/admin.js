import React from "react";
import "./admin.css";
import AdminGoods from "./admingoods";
import AdminPosts from "./adminposts"
import AdminUsers from "./adminusers";

class Admin extends React.Component {
    render() {

        return (
            <div className="Admin">
                <AdminUsers/>
                <AdminGoods/>
                <AdminPosts/>
            </div>
        );
    }
}

export default Admin;

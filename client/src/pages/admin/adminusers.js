import React from "react";
import "./admin.css";
import { listOfUsersForAdmin, addUser, updateUser, deleteUser } from "../../api";

class AdminUsers extends React.Component {
constructor(props) {
        super(props);
        this.state = {
            users: null,
            newUserEmail: "",
            newUserPassword: "",
            newuserNumber: null,
            editUserId: null,
            editUserEmail: "",
            editUserIsAdmin: false,
            editUserNumber: null,
        };
    }

    async componentDidMount() {
        await this.fetchUsers();
    }

    async fetchUsers() {
        try {
            const users = await listOfUsersForAdmin();
            this.setState({ users });
        } catch (error) {
            console.error("Ошибка загрузки пользователей:", error);
            this.setState({ users: [] });
        }
    }

    async handleAddUser() {
        try {
            await addUser({ 
                email: this.state.newUserEmail, 
                password: this.state.newUserPassword, 
                isAdmin: false 
            });
            this.setState({ newUserEmail: "", newUserPassword: "" });
            await this.fetchUsers();
        } catch (error) {
            console.error("Ошибка добавления пользователя:", error);
        }
    }

    async handleUpdateUser() {
        try {
            await updateUser(this.state.editUserId, {
                email: this.state.editUserEmail,
                isAdmin: this.state.editUserIsAdmin,
            });
            this.setState({ editUserId: null, editUserEmail: "", editUserIsAdmin: false });
            await this.fetchUsers();
        } catch (error) {
            console.error("Ошибка обновления пользователя:", error);
        }
    }

    async handleDeleteUser(userId) {
        try {
            await deleteUser(userId);
            await this.fetchUsers();
        } catch (error) {
            console.error("Ошибка удаления пользователя:", error);
        }
    }

    render() {
        const { users, newUserEmail, newUserPassword, editUserId, editUserEmail, editUserIsAdmin, newuserNumber } = this.state;

        return (<div>
            <h2>Admin Panel</h2>

<div className="userform">
    <h3>Add User</h3>
    <input 
        type="email" 
        placeholder="Email" 
        value={newUserEmail} 
        onChange={(e) => this.setState({ newUserEmail: e.target.value })} 
    />
    <input 
        type="number" 
        placeholder="Number" 
        value={newuserNumber} 
        onChange={(e) => this.setState({ newuserNumber: e.target.value })} 
    />
    <input 
        type="password" 
        placeholder="Password" 
        value={newUserPassword} 
        onChange={(e) => this.setState({ newUserPassword: e.target.value })} 
    />
    <button onClick={() => this.handleAddUser()}>Add User</button>
</div>

{users === null ? (
    <p>Loading users...</p>
) : users.length === 0 ? (
    <p>No users found</p>
) : (
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.number}</td>
                    <td>{user.isAdmin ? "✅ Yes" : "❌ No"}</td>
                    <td>
                        <button onClick={() => this.setState({ editUserId: user.id, editUserEmail: user.email, editUserIsAdmin: user.isAdmin , editUserNumber: user.number})}>
                            Edit
                        </button>
                        <button onClick={() => this.handleDeleteUser(user.id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)}

{editUserId && (
    <div className="formforusers">
        <h3>Edit User</h3>
        <input 
            type="email" 
            placeholder="Email" 
            value={editUserEmail} 
            onChange={(e) => this.setState({ editUserEmail: e.target.value })} 
        />
        <label>
            <input 
                type="checkbox" 
                checked={editUserIsAdmin} 
                onChange={(e) => this.setState({ editUserIsAdmin: e.target.checked })} 
            />
            Admin
        </label>
        <button onClick={() => this.handleUpdateUser()}>Save</button>
        <button onClick={() => this.setState({ editUserId: null })}>Cancel</button>
    </div>
)}
        </div>)
    }
}

export default AdminUsers

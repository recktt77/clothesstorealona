import React, { useEffect, useState } from "react";
import "./admin.css";
import { listOfUsersForAdmin, addUser, updateUser, deleteUser } from "../../api";

const AdminUsers = () => {
    const [users, setUsers] = useState(null);
    const [newUser, setNewUser] = useState({ email: "", password: "", number: "" });
    const [editUser, setEditUser] = useState(null);
    const [aaddUser, setAddUser] = useState(false)
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await listOfUsersForAdmin();
            setUsers(response);
        } catch (error) {
            console.error("Ошибка загрузки пользователей:", error);
            setUsers([]);
        }
    };

    const handleAddUser = async () => {
        try {
            await addUser({
                email: newUser.email,
                password: newUser.password,
                number: newUser.number,
                isAdmin: false,
            });
            setNewUser({ email: "", password: "", number: "" });
            fetchUsers();
            setAddUser(false)
        } catch (error) {
            console.error("Ошибка добавления пользователя:", error);
        }
    };

    const handleButtonAdd = async () =>{
        setAddUser(!aaddUser)
    }

    const handleUpdateUser = async () => {
        if (!editUser) return;
        console.log("Editing this user: ", editUser);
        try {
            await updateUser(editUser.id, {
                email: editUser.email,
                number: editUser.number,
                isAdmin: editUser.isAdmin,
            });

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.email === editUser.email ? { ...user, ...editUser } : user
                )
            );

            setEditUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Ошибка обновления пользователя:", error);
        }
    };

    const handleDeleteUser = async (userEmail) => {
        try {
            await deleteUser(userEmail);
            fetchUsers();
        } catch (error) {
            console.error("Ошибка удаления пользователя:", error);
        }
    };

    return (
        <div className="container">
            <h2>Admin Panel - Users</h2>
            <button className="buttonWight" onClick={handleButtonAdd}>Add user</button>
            {aaddUser &&(
                <div className="addGoods">
                <h3>Add User</h3>
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Number"
                    value={newUser.number}
                    onChange={(e) => setNewUser({ ...newUser, number: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <button className="buttonWight" onClick={handleAddUser}>Add User</button>
                <button className="buttonWight" onClick={handleButtonAdd}>Cancel</button>
            </div>
            )}
            <table className="table">
                <thead>
                    <tr>
                    <th>ID</th>
                            <th>Email</th>
                            <th>Number</th>
                            <th>Admin</th>
                            <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) && users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.id || "N/A"}</td>
                                <td>{user.email || "No Email"}</td>
                                <td>{user.number || 0}</td>
                                <td>{user.isAdmin ? "✅ Yes" : "❌ No"}</td>
                                <td>
                                    <button className="buttonWight" onClick={() => setEditUser(user)}>Edit</button>
                                    <button className="buttonWight" onClick={() => handleDeleteUser(user.email)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No Users found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editUser && (
                <div className="addGoods">
                    <h3>Edit User</h3>
                    <input
                        type="email"
                        placeholder="Email"
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Number"
                        value={editUser.number}
                        onChange={(e) => setEditUser({ ...editUser, number: e.target.value })}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={editUser.isAdmin}
                            onChange={(e) => setEditUser({ ...editUser, isAdmin: e.target.checked })}
                        />
                        Admin
                    </label>
                    <button className="buttonWight" onClick={handleUpdateUser}>Save</button>
                    <button className="buttonWight" onClick={() => setEditUser(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
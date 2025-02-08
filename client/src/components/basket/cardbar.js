import React from "react";
import "./CardBar.css"; // 👈 Import the new styles

const CardBar = () => {
    const userEmail = localStorage.getItem("userEmail") || "User";
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="cardbar-container">
            <div className="cardbar-header">
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                    alt="User Avatar" 
                    className="user-avatar"
                />
                <div>
                    <h2 className="user-name">{userEmail}</h2>
                    <p className="user-role">{isAdmin ? "👑 Администратор" : "🛍️ Покупатель"}</p>
                </div>
            </div>

            <button className="logout-button" onClick={handleLogout}>🚪 Выйти</button>
        </div>
    );
};

export default CardBar;

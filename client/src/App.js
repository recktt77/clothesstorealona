import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Ownpage from "./pages/ownpage/Ownpage";
import Shop from "./pages/shop/Shop";
import Post from "./pages/posts/Posts";
import NavBar from "./components/navigation/navbar";
import Admin from "./pages/admin/admin";
import Login from "../src/components/login/logining";
import ProtectedRoute from "../src/components/protection/ProtectedRouts";
import ChatAssistant from "./components/aiassistant/ChatAssistant";

const App = () => {
    const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

    useEffect(() => {
        console.log("App state updated:", userEmail, isAdmin);
    }, [userEmail, isAdmin]);

    // Функция входа пользователя
    const handleUserLogin = (email, isAdmin) => {
        console.log("User logged in:", email, isAdmin);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
        setUserEmail(email);
        setIsAdmin(isAdmin);
    };

    // Функция выхода пользователя
    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("isAdmin");

        setUserEmail("");
        setIsAdmin(false);
    };

    return (
        <div className="app">
            <Router>
                <div>
                    {/* Навигационная панель */}
                    <NavBar onLogout={handleLogout} userEmail={userEmail} isAdmin={isAdmin} onSubmit={handleUserLogin} />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/post" element={<Post />} />
                        <Route path="/ownpage" element={<Ownpage />} />
                        <Route path="/login" element={<Login onSubmit={handleUserLogin} />} />

                        {/* Доступ к админке только для админа */}
                        <Route element={<ProtectedRoute isAdmin={isAdmin} />}>
                            <Route path="/admin" element={<Admin />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
            
            {/* Чат-ассистент */}
            <ChatAssistant />
        </div>
    );
};

export default App;

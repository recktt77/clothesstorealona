import React, { useEffect, useState } from "react";
import { addPost } from "../../api";
import "./CreatePost.css"; 

const CreatePost = ({ onPostCreated }) => {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [body, setBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            alert("Вы не вошли в аккаунт!");
            return;
        }

        if (!title.trim() || !link.trim() || !body.trim()) {
            alert("Пожалуйста, заполните все поля!");
            return;
        }

        setIsSubmitting(true);
        try {
            const newPost = await addPost({ userEmail, title, link, body, likes: 0 });
            alert("✅ Пост успешно добавлен!");
            setTitle("");
            setLink("");
            setBody("");
            onPostCreated(newPost);
        } catch (error) {
            console.error("Ошибка при добавлении поста:", error);
            alert("❌ Не удалось добавить пост.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit} className="create-post-form">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="text"
                    placeholder="Link to image"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="input-field"
                    required
                />
                <textarea
                    placeholder="description"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="input-field textarea"
                    required
                />
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? "⏳ posting..." : "📢 Post"}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;

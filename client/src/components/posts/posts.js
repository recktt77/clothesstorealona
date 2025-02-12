import React, { useState, useEffect } from "react";
import axios from "axios";
import { likeLogic } from "../../api";

const Posts = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загружаем все посты при первом рендере
    useEffect(() => {
        fetchPosts();
    }, []);

    // Функция загрузки постов из базы
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:4000/posts");
            setData(response.data);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    // Функция лайка (теперь берёт данные из базы)
    const handleLikeLogic = async (postId) => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            alert("Вы не вошли в аккаунт");
            return;
        }
        try {
            await likeLogic(userEmail, postId);

            // После успешного лайка запрашиваем обновленные данные конкретного поста
            const updatedPost = await axios.get(`http://localhost:4000/posts/${postId}`);

            // Обновляем только изменённый пост в состоянии
            setData((prevData) =>
                prevData.map((post) => (post.id === postId ? updatedPost.data : post))
            );
        } catch (error) {
            alert(error.message);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="posts">
            {data.map((item) => (
                <div key={item.id} className="container-wrap">
                    <h2 className="title-post">{item.title}</h2>
                    <div className="item-post" id={item.id}>
                        <img className="img-post" src={item.link} alt={item.title} />
                        <h3 className="body">{item.body}</h3>
                        <button className="likes" onClick={() => handleLikeLogic(Number(item.id))}>
                            ❤️ {item.likes}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Posts;

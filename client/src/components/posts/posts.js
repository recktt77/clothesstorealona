import React, { useState, useEffect } from "react";
import axios from "axios";
import { likeLogic } from "../../api";

const Posts = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Данные после поиска и сортировки
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Поиск по названию
    const [sortOrder, setSortOrder] = useState("none"); // Сортировка по лайкам

    // Загружаем все посты при первом рендере
    useEffect(() => {
        fetchPosts();
    }, []);

    // Загружаем посты из базы
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:4000/posts");
            setData(response.data);
            setFilteredData(response.data); // Начальная сортировка - все посты
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    // Лайк поста (обновление лайков из базы)
    const handleLikeLogic = async (postId) => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            alert("Вы не вошли в аккаунт");
            return;
        }
        try {
            await likeLogic(userEmail, postId);

            // Получаем обновленный пост из базы
            const updatedPost = await axios.get(`http://localhost:4000/posts/${postId}`);

            // Обновляем только изменённый пост в состоянии
            setData((prevData) =>
                prevData.map((post) => (post.id === postId ? updatedPost.data : post))
            );
        } catch (error) {
            alert(error.message);
        }
    };

    // Поиск и сортировка постов
    useEffect(() => {
        let filtered = data;

        // Поиск по названию
        if (searchTerm) {
            filtered = filtered.filter((post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Сортировка по количеству лайков
        if (sortOrder === "asc") {
            filtered = [...filtered].sort((a, b) => a.likes - b.likes);
        } else if (sortOrder === "desc") {
            filtered = [...filtered].sort((a, b) => b.likes - a.likes);
        }

        setFilteredData(filtered);
    }, [searchTerm, sortOrder, data]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="posts">
            {/* Фильтры: поиск и сортировка */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="none">Без сортировки</option>
                    <option value="asc">Сначала меньше</option>
                    <option value="desc">Сначала больше</option>
                </select>
            </div>

            {/* Отображение постов */}
            {filteredData.map((item) => (
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

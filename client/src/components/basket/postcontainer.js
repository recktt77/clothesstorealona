import React, { useState, useEffect } from "react";
import { getUserPosts } from "../../api";

const PostContainer = () => {
    const [posts, setPosts] = useState([]);
    let userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            fetchPosts();
        }
    }, [userId]);

    const fetchPosts = async () => {
        userId = parseInt(userId);

        if (isNaN(userId)) {
            console.error("Ошибка: userId не определен!", userId);
            return;
        }

        try {
            const userPosts = await getUserPosts(userId);
            setPosts(userPosts);
        } catch (error) {
            console.error("Ошибка загрузки постов пользователя:", error);
        }
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-lg w-full">
            {posts.length === 0 ? <p>there is no posts</p> : (
                <div className="grid grid-cols-2 gap-2">
                    {posts.map(post => (
                        <div key={post.id} className="border p-2 rounded-lg">
                            <img src={post.link} alt={post.title} className="w-full rounded-lg" />
                            <h2 className="text-sm mt-2">{post.title}</h2>
                            <p className="text-sm mt-2">{post.body}</p>
                            <p className="text-sm mt-2">❤️ {post.likes}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostContainer;

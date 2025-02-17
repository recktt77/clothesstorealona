import React, { useState, useEffect } from "react";
import { getUserPosts } from "../../api";

const PostContainer = () => {
    const [posts, setPosts] = useState([]);
    const userEmail = localStorage.getItem("userEmail");
    useEffect(() => {
        if(userEmail){
            fetchUserPosts();
        } else {
            setPosts([]);
        }
    }, [userEmail]);


    const fetchUserPosts = async () => {
        try {
            const response = await getUserPosts(userEmail);
            console.log(response);
            setPosts(response);
        } catch (error) {
            console.error("Error fetching user posts: ", error);
        }
    }

    console.log(posts);
    return (
        <div className="bg-white p-4 shadow-md rounded-lg w-full">
            {posts.length === 0 ? <p>There are no posts</p> : (
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

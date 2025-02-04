import React, { useEffect, useState } from "react";
import "./admin.css";
import { getAllPosts, addPost, updatePost, deletePost } from "../../api";

const AdminPosts = () => {
    const [posts, setPosts] = useState(null);
    const [newPost, setNewPost] = useState({ title: "", link: "", body: "", likes: 0 });
    const [editPost, setEditPost] = useState(null);
    const [aaddPost, setAddPost] = useState(false)

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await getAllPosts();
            setPosts(response);
        } catch (error) {
            console.error("Ошибка загрузки постов:", error);
            setPosts([]);
        }
    };

    const handleAddPost = async () => {
        try {
            await addPost({
                title: newPost.title,
                link: newPost.link,
                body: newPost.body,
                likes: parseInt(newPost.likes, 10),
            });
            setNewPost({ title: "", link: "", body: "", likes: 0 });
            fetchPosts();
            setAddPost(false)
        } catch (error) {
            console.error("Ошибка добавления поста:", error);
        }
    };

    const handleButtonAdd = async () =>{
        setAddPost(!aaddPost)
    }

    const handleUpdatePost = async () => {
        if (!editPost) return;
        try {
            await updatePost(editPost.id, {
                title: editPost.title,
                link: editPost.link,
                body: editPost.body,
                likes: parseInt(editPost.likes, 10),
            });
            setEditPost(null);
            fetchPosts();
        } catch (error) {
            console.error("Ошибка обновления поста:", error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId);
            fetchPosts();
        } catch (error) {
            console.error("Ошибка удаления поста:", error);
        }
    };

    return (
        <div className="container">
            <h2>Admin Panel - Posts</h2>
            <button className="buttonWight" onClick={handleButtonAdd}>addPost</button>
            {aaddPost && (
                <div className="addGoods">
                <h3>Add Post</h3>
                <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
                <input type="text" placeholder="Image Link" value={newPost.link} onChange={(e) => setNewPost({ ...newPost, link: e.target.value })} />
                <textarea placeholder="Body" value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} />
                <input type="number" placeholder="Likes" value={newPost.likes} onChange={(e) => setNewPost({ ...newPost, likes: e.target.value })} />
                <button className="buttonWight" onClick={handleAddPost}>Add Post</button>
                <button className="buttonWight" onClick={handleButtonAdd}>Cancel</button>
            </div>
            )}


            <table className="table">
                <thead>
                    <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Link</th>
                            <th>Body</th>
                            <th>Likes</th>
                            <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post, index) => (
                            <tr key={index}>
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td><img src={post.link} alt={post.title} width="50" /></td>
                                <td>{post.body}</td>
                                <td>{post.likes}</td>
                                <td>
                                    <button className="buttonWight" onClick={() => setEditPost(post)}>Edit</button>
                                    <button className="buttonWight" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No Posts found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editPost && (
                <div className="addGoods">
                    <h3>Edit Post</h3>
                    <input type="text" placeholder="Title" value={editPost.title} onChange={(e) => setEditPost({ ...editPost, title: e.target.value })} />
                    <input type="text" placeholder="Image Link" value={editPost.link} onChange={(e) => setEditPost({ ...editPost, link: e.target.value })} />
                    <textarea placeholder="Body" value={editPost.body} onChange={(e) => setEditPost({ ...editPost, body: e.target.value })} />
                    <input type="number" placeholder="Likes" value={editPost.likes} onChange={(e) => setEditPost({ ...editPost, likes: e.target.value })} />
                    <button className="buttonWight" onClick={handleUpdatePost}>Save</button>
                    <button className="buttonWight" onClick={() => setEditPost(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AdminPosts;

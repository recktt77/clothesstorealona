import React from "react";
import "./admin.css";
import { getAllPosts, addPost, updatePost, deletePost } from "../../api";

class AdminPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null,
            newPostTitle: "",
            newPostLink: "",
            newPostBody: "",
            newPostLikes: 0,
            editPostId: null,
            editPostTitle: "",
            editPostLink: "",
            editPostBody: "",
            editPostLikes: 0,
        };
    }

    async componentDidMount() {
        await this.fetchPosts();
    }

    async fetchPosts() {
        try {
            const posts = await getAllPosts();
            this.setState({ posts });
        } catch (error) {
            console.error("Ошибка загрузки постов:", error);
            this.setState({ posts: [] });
        }
    }

    async handleAddPost() {
        try {
            await addPost({
                title: this.state.newPostTitle,
                link: this.state.newPostLink,
                body: this.state.newPostBody,
                likes: parseInt(this.state.newPostLikes, 10),
            });
            this.setState({ newPostTitle: "", newPostLink: "", newPostBody: "", newPostLikes: 0 });
            await this.fetchPosts();
        } catch (error) {
            console.error("Ошибка добавления поста:", error);
        }
    }

    async handleUpdatePost() {
        try {
            await updatePost(this.state.editPostId, {
                title: this.state.editPostTitle,
                link: this.state.editPostLink,
                body: this.state.editPostBody,
                likes: parseInt(this.state.editPostLikes, 10),
            });
            this.setState({ editPostId: null, editPostTitle: "", editPostLink: "", editPostBody: "", editPostLikes: 0 });
            await this.fetchPosts();
        } catch (error) {
            console.error("Ошибка обновления поста:", error);
        }
    }

    async handleDeletePost(postId) {
        try {
            await deletePost(postId);
            await this.fetchPosts();
        } catch (error) {
            console.error("Ошибка удаления поста:", error);
        }
    }

    render() {
        const { posts, newPostTitle, newPostLink, newPostBody, newPostLikes, editPostId, editPostTitle, editPostLink, editPostBody, editPostLikes } = this.state;

        return (
            <div className="Admin">
                <h2>Admin Panel - Posts</h2>

                <div>
                    <h3>Add Post</h3>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={newPostTitle} 
                        onChange={(e) => this.setState({ newPostTitle: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Image Link" 
                        value={newPostLink} 
                        onChange={(e) => this.setState({ newPostLink: e.target.value })} 
                    />
                    <textarea 
                        placeholder="Body" 
                        value={newPostBody} 
                        onChange={(e) => this.setState({ newPostBody: e.target.value })} 
                    />
                    <input 
                        type="number" 
                        placeholder="Likes" 
                        value={newPostLikes} 
                        onChange={(e) => this.setState({ newPostLikes: e.target.value })} 
                    />
                    <button onClick={() => this.handleAddPost()}>Add Post</button>
                </div>

                {posts === null ? (
                    <p>Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p>No posts found</p>
                ) : (
                    <table>
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
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>{post.title}</td>
                                    <td><img src={post.link} alt={post.title} width="50" /></td>
                                    <td>{post.body}</td>
                                    <td>{post.likes}</td>
                                    <td>
                                        <button onClick={() => this.setState({ 
                                            editPostId: post.id, 
                                            editPostTitle: post.title, 
                                            editPostLink: post.link, 
                                            editPostBody: post.body, 
                                            editPostLikes: post.likes 
                                        })}>
                                            Edit
                                        </button>
                                        <button onClick={() => this.handleDeletePost(post.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {editPostId && (
                    <div>
                        <h3>Edit Post</h3>
                        <input 
                            type="text" 
                            placeholder="Title" 
                            value={editPostTitle} 
                            onChange={(e) => this.setState({ editPostTitle: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Image Link" 
                            value={editPostLink} 
                            onChange={(e) => this.setState({ editPostLink: e.target.value })} 
                        />
                        <textarea 
                            placeholder="Body" 
                            value={editPostBody} 
                            onChange={(e) => this.setState({ editPostBody: e.target.value })} 
                        />
                        <input 
                            type="number" 
                            placeholder="Likes" 
                            value={editPostLikes} 
                            onChange={(e) => this.setState({ editPostLikes: e.target.value })} 
                        />
                        <button onClick={() => this.handleUpdatePost()}>Save</button>
                        <button onClick={() => this.setState({ editPostId: null })}>Cancel</button>
                    </div>
                )}
            </div>
        );
    }
}

export default AdminPosts;

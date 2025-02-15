import React, {useState, useEffect} from "react";
import PostContainer from "../../components/basket/postcontainer";
import CardBasket from "../../components/basket/cardbasket";
import CardBar from "../../components/basket/cardbar";
import Payment from "../../components/basket/payment";
import CreatePost from "../../components/basket/createPost";
import { getUserPosts } from "../../api";
import "./Ownpage.css"

const Ownpage = () => {
    const [posts, setPosts] = useState([]);
    const userEmail = localStorage.getItem("userEmail");

    const fetchUserPosts = async () => {
        if (!userEmail) return;
        
        try {
            const userPosts = await getUserPosts(userEmail);
            setPosts(userPosts || []);
        } catch (error) {
            console.error("Ошибка загрузки постов пользователя:", error);
            setPosts([]);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, [userEmail]);

    return (
        <div className="ownpage-container">
            <div className="ownpage-bottom">
                <div className="ownpage-cart card-container">
                    <CardBasket />
                </div>

                <div className="ownpage-payment card-container">
                    <Payment />
                </div>
            </div>
            <div className="ownpage-content">
                <div className="ownpage-left">
                    <div className="card-container">
                        <h2 className="section-title">Profile</h2>
                        <CardBar />
                    </div>

                    <div className="card-container">
                        <h2 className="section-title">createPost</h2>
                        <CreatePost onPostCreated={fetchUserPosts} />
                    </div>
                </div>

                <div className="ownpage-right">
                    <div className="post-card">
                        <h2 className="section-title">your posts</h2>
                        <PostContainer posts={posts} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ownpage;
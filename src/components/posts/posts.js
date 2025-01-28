import React from "react";
import data from './posts.json';
import Button from "../navigation/button";

class Posts extends React.Component {
    render() {
        return (
            <div className="posts">
                {data.map((item) => (
                    <div className="container-wrap">
                        <h2 className="title-post">{item.title}</h2>
                        <div className="item-post" id={item.id}>
                            <img className="img-post" src={item.link} />
                            <h3 className="body">{item.body}</h3>
                            <h3 className="likes">{item.likes}</h3>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

export default Posts
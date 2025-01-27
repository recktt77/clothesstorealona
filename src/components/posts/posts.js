import React from "react";
import data from './posts.json';
import Button from "../navigation/button";

class Posts extends React.Component {
    render() {
        return (
            <div className="posts">
                {data.map((item) => (
                    <div className="item" id={item.id}>
                        <img src={item.link} />
                        <h2 className="title">{item.title}</h2>
                        <h3 className="body">{item.body}</h3>
                        <h3 className="likes">{item.likes}</h3>
                    </div>
                ))}
            </div>
        )
    }
}

export default Posts
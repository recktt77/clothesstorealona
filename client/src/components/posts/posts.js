import React from "react";
import Button from "../navigation/button";
import axios from "axios";

class Posts extends React.Component {
    constructor(props){
        super(props)
        this.state={
            data: [],
            isLoading: true,
            error: null,
        }
    }

    componentDidMount(){
        axios.get("http://localhost:4000/posts")
        .then((response)=>{
            this.setState({
                data: response.data,
                isLoading: false,
            })
        })
        .catch((err) => {
            this.setState({
                error: err.message,
                loading: false,
            });
        })

    }
    render() {
        const { data, loading, error } = this.state;

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;
        return (
            <div className="posts">
                {data.map((item) => (
                    <div key={item.id} className="container-wrap">
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
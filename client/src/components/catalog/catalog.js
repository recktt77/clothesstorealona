import React from "react";
import Button from "../navigation/button";
import axios from "axios";

class Catalog extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            data: [],
            loading: true,
            error: null,
        }
    }

    componentDidMount(){
        axios.get("http://localhost:4000/goods")
        .then((response)=>{
            this.setState({
                data: response.data,
                loading: false
            })
        })
        .catch((err) => {
            this.setState({
                error: err.message,
                loading: false,
            });
        });
    }

    render() {
        const { data, loading, error } = this.state;

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;
        return (
            <div className="catalog">
                {data.map((item) => (
                    <div className="item" id={item.id} key={item.id}>
                        <img src={item.images} />
                        <h2 className="title">{item.title}</h2>
                        <h3 className="price">{item.price}</h3>
                        <Button buttoname='add'/>
                    </div>
                ))}
            </div>
        )
    }
}

export default Catalog
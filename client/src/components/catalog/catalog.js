import React from "react";
import axios from "axios";
import { addToCart } from "../../api";

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

    handleAddToCart = async (goodId) => {
        const userEmail = localStorage.getItem("userEmail"); 
        if (!userEmail) {
            alert("Вы не вошли в аккаунт");
            return;
        }
        try {
            console.log(goodId)
            await addToCart(userEmail, goodId);
            alert("Товар добавлен в корзину!");
        } catch (error) {
            alert(error.message);
        }
    };
    
    render() {
        const { data, loading, error } = this.state;

        if (loading) return <p>Loading..</p>;
        if (error) return <p>Error: {error}</p>;
        return (
            <div className="catalog">
                {data.map((item) => (
                    <div className="item" id={item.id} key={item.Id}>
                        <img src={item.Image} alt={item.Title} />
                        <h2 className="title">{item.Title}</h2>
                        <h3 className="price">{item.Price}</h3>
                        <button className="buttonWight" onClick={() => this.handleAddToCart(Number(item.Id))}>add to basket</button>
                    </div>
                ))}
            </div>
        )
    }
}

export default Catalog;

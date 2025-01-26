import React from "react";
import data from './data.json';
import '../../../node_modules/bootstrap/dist/css/bootstrap.css';

class Catalog extends React.Component {
    render() {
        return (
            <div className="catalog container-fluid">
                {data.map((item) => (
                    <div className="item col-md-4" id={item.id}>
                        <img src={item.images} />
                        <h2 className="title">{item.title}</h2>
                        <h3 className="price">{item.price}</h3>
                        <button>Add to cart</button>
                    </div>
                ))}
            </div>
        )
    }
}

export default Catalog
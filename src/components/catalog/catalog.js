import React from "react";
import data from './data.json';
import Button from "../navigation/button";

class Catalog extends React.Component {
    render() {
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
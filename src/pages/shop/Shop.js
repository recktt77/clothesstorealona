import React from "react";
import "./Shop.css";
import Catalog from "../../components/catalog/catalog";

class Shop extends React.Component {
  render(){
    return (
      <div className="Shop">
        <Catalog />
      </div>
    );
  }
}
export default Shop;

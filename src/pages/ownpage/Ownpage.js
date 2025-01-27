import React from "react";
import "./Ownpage.css";
import CardBar from "../../components/basket/cardbar";
import Cardbasket from "../../components/basket/cardbasket";

class Ownpage extends React.Component {
  render(){
    return (
      <div className="Ownpage">
        <Cardbasket/>
        <CardBar/>
      </div>
    );
  }
}
export default Ownpage;

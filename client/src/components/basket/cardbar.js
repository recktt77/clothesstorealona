import React from "react";
import Button from "../navigation/button"
class CardBar extends React.Component{
    render(){
        return(
            <div className="cardbar">
                <h2>Total</h2>
                <hr/>
                <p>Price</p>
                <label for="delivery">Type of delivery:</label>

                <select name="delivery" id="delivery">
                    <option value="defoult">Defoult free</option>
                    <option value="express">Fast for addtional 5$</option>
                </select>

                <Button buttoname="Next"/>
            </div>
        )
    }
}

export default CardBar
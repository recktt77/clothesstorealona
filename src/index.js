import React from "react";
import * as ReactDOMClinet from 'react-dom/client';

const inputClick = ()=>{
  console.log("clicked")
}

const mouseOver = () => {
  console.log("Mouse over")
}
const helpText = "help text!"
const elements = (
  <div className="name">
    <h1>{helpText}</h1>
    <input placeholder={helpText} onClick={inputClick}  onMouseEnter={mouseOver}/>
    <p>{helpText === "help text!" ? "yes": "no"}</p>
  </div>
)

const app = ReactDOMClinet.createRoot(document.getElementById("app"))

app.render(elements)
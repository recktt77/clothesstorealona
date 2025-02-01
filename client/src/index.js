import React from "react";
import * as ReactDOMClinet from 'react-dom/client';
import App from "./App";
import "./index.css"

class Index extends React.Component{
  render(){
    return(
      <App/>
    )
  }
}

const app = ReactDOMClinet.createRoot(document.getElementById("app"))

app.render(<Index/>)
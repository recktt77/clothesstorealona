import React from "react";
import * as ReactDOMClinet from 'react-dom/client';
import NavBar from "./components/ui/navigation/navbar";
import Main from "./components/ui/main/main";

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <Main />
      </div>
    )
  }
}

const app = ReactDOMClinet.createRoot(document.getElementById("app"))

app.render(<App />)
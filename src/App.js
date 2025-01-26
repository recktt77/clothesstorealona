import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Ownpage from "./pages/ownpage/Ownpage";
import Shop from "./pages/shop/Shop";
import Post from "./pages/posts/Posts";
import NavBar from "./components/navigation/navbar";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/post" element={<Post />} />
            <Route path="/ownpage" element={<Ownpage />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Ownpage from "./pages/ownpage/Ownpage";
import Shop from "./pages/shop/Shop";
import Post from "./pages/posts/Posts";
import NavBar from "./components/navigation/navbar";
import Admin from "./pages/admin/admin";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isAdmin: false,
      userEmail: ""
    };

    this.handleUserLogin = this.handleUserLogin.bind(this);
  }

  handleUserLogin(email, isAdmin) {
    this.setState({ userEmail: email, isAdmin });
  }


  render() {
    return (
      <Router>
        <div>
          <NavBar onSubmit={this.hendlerAdminPage}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/post" element={<Post />} />
            <Route path="/ownpage" element={<Ownpage />} />
            <Route path="/admin" element={<Admin/>}/>
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;

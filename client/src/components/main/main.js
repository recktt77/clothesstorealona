import React from "react";
import Image from "./image";

class Main extends React.Component{
    render(){
        return(
            <div className="main">
                <div className="images">
                    <img className="main-page-image" src="https://style.pibig.info/uploads/posts/2023-03/1680127706_style-pibig-info-p-bezhevie-luki-zhenskie-pinterest-11.jpg" />
                    <img className="main-page-image" src="https://www.myjane.ru/data/cache/2016oct/19/31/624537_81604nothumb650.jpg" />
                    <img className="main-page-image" src="https://kokoshop.eu/content/images/preces/14335.jpg" />
                    <img className="main-page-image" src="https://i.pinimg.com/736x/c7/2d/c3/c72dc372f70aba9acf51e5395ae12d58.jpg" />
                </div>
                <div className="text">
                    <h1 className="brand">ALONA</h1>
                    <p className="desc">Elegance in every detail. Modern fashion inspired by timeless classics</p>
                </div>
            </div>
        )
    }
}

export default Main
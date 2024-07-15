import React from "react";
import { Link } from "react-router-dom";
import "./home.scss";

const Home = () => {
  return (
    <div className="container">
      <div className="header">
        <Link to="/home">
          <img
            src={require("./log.png")}
            alt="Logo"
            className="log"
            style={{ width: 150, height: 150 }}
          />
        </Link>
        <div className="button-container">
          <Link to="/notifications" className="nav-lightning nav-button">
            Notifications
          </Link>
          <Link to="/history" className="nav-lightning nav-button">
            History
          </Link>
        </div>
      </div>
      <div className="section">
        <div className="section-item">
          <Link to="/create-request/food">
            <img src={require("./food.jpg")} alt="Food" />
            <p className="lightning-effect">Food</p>
          </Link>
        </div>
        <div className="section-item1">
          <Link to="/create-request/medicines">
            <img src={require("./medi.jpg")} alt="Medicines" />
            <p className="lightning-effect">Medicines</p>
          </Link>
        </div>
        <div className="section-item2">
          <Link to="/create-request/others">
            <img src={require("./ai4.jpg")} alt="Others" />
            <p className="lightning-effect">Others</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

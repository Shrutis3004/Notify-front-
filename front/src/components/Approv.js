import React from "react";
import "./success.scss";
import { Link } from "react-router-dom";
const Approv = () => {
  return (
    <div className="success-container">
      <div className="header">
        <Link to="/home">
          <img
            src={require("./log.png")}
            alt="Logo"
            className="log"
            style={{ width: 150, height: 150 }}
          />
        </Link>
      </div>
      <h1 className="success-text">YES WE DID IT!</h1>
      <div className="button-container">
        <Link to="/home">
          <button className="home-button">Go to Home Page</button>
        </Link>
      </div>
    </div>
  );
};

export default Approv;

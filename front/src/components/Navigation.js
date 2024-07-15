import React from "react";
import { Link } from "react-router-dom";
import "./navigation.scss";
import logo from "./log.png"; // Import the logo image

const Navigation = () => {
  return (
    <nav className="nav-navigation">
      <ul>
        <li>
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
            <div className="button-container">
              <Link to="/register" className="nav-lightning nav-button">
                Register
              </Link>
              <Link to="/login" className="nav-lightning nav-button">
                Login
              </Link>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

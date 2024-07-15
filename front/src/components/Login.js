import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../components/api";
import "./login.scss"; // Assuming this imports your login styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      console.error("Response data:", error.response?.data);
      if (error.response?.status === 404) {
        toast.error("You are not registered, please register yourself first.");
      } else if (error.response?.status === 400) {
        toast.error(
          "Invalid credentials, please check your email and password."
        );
      } else {
        toast.error("An error occurred during login. Please try again later.");
      }
    }
  };

  return (
    <div className="login-body">
      <div className="header">
        <img
          src={require("./log.png")}
          alt="Logo"
          className="log"
          style={{ width: 150, height: 150 }}
        />
      </div>
      {/* Apply login-body class here */}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="form-input login-lightning"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="form-input login-lightning"
        />
        <button type="submit" className="form-button login-lightning">
          Login
        </button>
        <span className="hel">
          <p className="pa">Already have an account?</p>
          <Link to="/register">Register</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;

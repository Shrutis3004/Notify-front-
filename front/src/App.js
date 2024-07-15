import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import CreateRequest from "./components/CreateRequest";
import Notifications from "./components/Notifications";
import Navigation from "./components/Navigation";
import Approv from "./components/Approv";
import History from "./components/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigation />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-request/:type" element={<CreateRequest />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/success" element={<Approv />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./historry.scss"; // Import SCSS styles

const History = () => {
  const [requests, setRequests] = useState([]);
  const [regeneratedRequests, setRegeneratedRequests] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in local storage");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/requests/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setRequests(response.data);
        } else {
          console.error("Error fetching requests:", response.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleRegenerate = async (requestId, createdAt) => {
    if (regeneratedRequests[requestId]) {
      toast.error("You have already regenerated the message.");
      return;
    }

    const twelveHours = 12 * 60 * 60 * 1000;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const timeElapsed = new Date() - new Date(createdAt);

    if (timeElapsed < twelveHours) {
      toast.warn(
        "This button will get active after 12 hours of sending the request."
      );
      return;
    }

    if (timeElapsed > twentyFourHours) {
      toast.error(
        "The request was generated more than 24 hours ago. Please refill the form."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/requests/${requestId}/regenerate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Request regenerated successfully.");
        setRegeneratedRequests((prev) => ({
          ...prev,
          [requestId]: true,
        }));
      } else {
        console.error("Error regenerating request:", response.data);
      }
    } catch (error) {
      console.error("Error regenerating request:", error);
    }
  };

  return (
    <div className="history-body">
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
      <h1 className="head">Request History</h1>
      {requests.map((request) => (
        <div key={request._id} className="request-container">
          <p>Type: {request.type}</p>
          <p>Message: {request.message}</p>
          {request.image && (
            <img src={`http://localhost:5000/${request.image}`} alt="Request" />
          )}
          <button
            onClick={() => handleRegenerate(request._id, request.createdAt)}
          >
            Regenerate
          </button>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default History;

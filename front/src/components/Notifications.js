import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notifications.scss"; // Ensure the correct import path for your SCSS file

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    accepted: [],
    declined: [],
    pending: [],
  });

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        "http://localhost:5000/api/requests",
        config
      );

      const categorizedNotifications = {
        accepted: response.data.filter((n) => n.status === "accepted"),
        declined: response.data.filter((n) => n.status === "declined"),
        pending: response.data.filter(
          (n) => !n.status || n.status === "pending"
        ),
      };

      setNotifications(categorizedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleResponse = async (notificationId, response) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      await axios.post(
        "http://localhost:5000/api/requests/respond",
        { notificationId, response },
        config
      );
      console.log("Response recorded, fetching updated notifications...");
      fetchNotifications();
    } catch (error) {
      console.error("Error responding to notification:", error);
    }
  };

  const getAcceptanceText = (notification) => {
    const userId = localStorage.getItem("userId");
    if (!notification.acceptedBy) {
      return "Accepted by others";
    } else if (notification.acceptedBy._id === userId) {
      return "(Accepted by me)";
    } else {
      return `(Accepted by ${notification.acceptedBy.username})`;
    }
  };

  return (
    <div className="notifications-body">
      <h1 className="notifications-heading">Notifications</h1>

      <div className="notification-section">
        <h2>Accepted</h2>
        {notifications.accepted.map((notification) => (
          <div key={notification._id} className="notification-container">
            <p className="notification-message">
              {notification.message} {getAcceptanceText(notification)}
            </p>
          </div>
        ))}
      </div>

      <div className="notification-section">
        <h2>Declined</h2>
        {notifications.declined.map((notification) => (
          <div key={notification._id} className="notification-container">
            <p className="notification-message">{notification.message}</p>
          </div>
        ))}
      </div>

      <div className="notification-section">
        <h2>Pending</h2>
        {notifications.pending.map((notification) => (
          <div key={notification._id} className="notification-container">
            <p className="notification-message">{notification.message}</p>
            <div className="notification-buttons">
              <button
                className="notification-button"
                onClick={() => handleResponse(notification._id, "accept")}
              >
                Accept
              </button>
              <button
                className="notification-button"
                onClick={() => handleResponse(notification._id, "decline")}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

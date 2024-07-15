import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState(
    new Array(6).fill("")
  );
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { coords } = await getLocation();
    const location = { coordinates: [coords.longitude, coords.latitude] };
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
        phoneNumber,
        location,
      });
      await axios.post("http://localhost:5000/api/requests/send-sms", {
        message: `A new user registered with phone number ${phoneNumber}`,
      });
      setShowVerification(true);
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Response data:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join("");
    try {
      await axios.post("http://localhost:5000/api/requests/send-sms", {
        message: `Verification code: ${code}`,
        to: "+916291153739",
      });
      navigate("/login");
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      if (index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <div className="register-body">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <img
              src={require("./ima1.jpg")}
              alt="Loading image"
              className="loading-image"
            />
          </div>
          <div className="blur-background" />
        </div>
      )}
      <div className="header">
        <img
          src={require("./log.png")}
          alt="Logo"
          className="log"
          style={{ width: 150, height: 150 }}
        />
      </div>
      <div className="register-form-container">
        {!showVerification ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Name"
              required
              className="register-input-field"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="register-input-field"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="register-input-field"
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              required
              className="register-input-field"
            />
            <button type="submit" className="register-submit-button">
              Register
            </button>
            <span className="hel">
              <p>Already have an account?</p>
              <Link to="/login">Login</Link>
            </span>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit}>
            <div className="verification-container">
              <p>Enter the 6-digit verification code sent to your phone:</p>
              <div className="code-inputs">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(e, index)}
                    maxLength="1"
                    className="code-input"
                  />
                ))}
              </div>
              <button type="submit" className="verification-submit-button">
                Verify
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;

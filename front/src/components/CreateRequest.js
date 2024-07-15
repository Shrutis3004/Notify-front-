import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VoiceToText from "./VoiceToText";
import { FaMicrophone } from "react-icons/fa";
import { BiMicrophoneOff } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import "./create-request.scss";

const CreateRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === "/create-request/food") {
      setType("food");
    } else if (location.pathname === "/create-request/medicines") {
      setType("medicine");
    } else {
      setType("others");
    }
  }, [location]);

  const handleTextCaptured = (text) => {
    setMessage(text);
  };

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 3000;

  const handleImageUpload = async () => {
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("language", "eng");

        const apiKey = "K88939154388957";
        const endpoint = "https://api.ocr.space/parse/image";

        const response = await axios.post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            apikey: apiKey,
          },
          timeout: 30000,
        });

        if (response.status === 200) {
          const parsedText = response.data.ParsedResults[0].ParsedText;
          setMessage(parsedText);

          if (parsedText.toLowerCase().includes("food")) {
            setType("food");
          } else if (parsedText.toLowerCase().includes("medicine")) {
            setType("medicine");
          } else {
            setType("");
          }

          return;
        } else {
          console.error("Error recognizing image. Status:", response.status);
          console.error(response.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request cancelled:", error.message);
        } else if (error.response) {
          console.error(
            "Error recognizing image. Status:",
            error.response.status
          );
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      }

      retries++;
      if (retries < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }

    console.error("Exceeded maximum retries. Unable to process image.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage");
        return;
      }

      const formData = new FormData();
      formData.append("type", type);
      formData.append("message", message);
      if (image) {
        formData.append("image", image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/requests",
        formData,
        config
      );

      if (response.status === 201) {
        navigate("/success", { replace: true });
      } else {
        console.error("Error submitting request:", response.data);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const isFoodRoute = location.pathname === "/create-request/food";
  const isMedicineRoute = location.pathname === "/create-request/medicines";

  return (
    <div
      className={`create-request-body ${
        isFoodRoute ? "food" : isMedicineRoute ? "medicines" : ""
      }`}
    >
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
        <Link to="/home">
          <img
            src={require("./log.png")}
            alt="Logo"
            className="log"
            style={{ width: 150, height: 150 }}
          />
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="create-request-form-container">
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type"
          required
          className="create-request-input"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write here what you Need"
          rows={4}
          className="create-request-textarea"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="create-request-file-input"
        />
        <div className="create-request-image-preview">
          {image && (
            <>
              <img src={URL.createObjectURL(image)} alt="Image preview" />
              <MdDelete
                className="create-request-delete-icon"
                onClick={() => setImage(null)}
              />
            </>
          )}
        </div>
        <p className="ima">To Fetch the image click on below button :</p>
        <button
          type="button"
          onClick={handleImageUpload}
          className="create-request-button"
        >
          Recognize Image
        </button>
        <VoiceToText
          onTextCaptured={handleTextCaptured}
          isListening={isListening}
          setIsListening={setIsListening}
        >
          <p className="speak">
            Speak here: {isListening ? <BiMicrophoneOff /> : <FaMicrophone />}
          </p>
        </VoiceToText>
        <button type="submit" className="create-request-button1">
          Submit
        </button>
        <div className="create-request-lightning-effect" />
      </form>
    </div>
  );
};

export default CreateRequest;

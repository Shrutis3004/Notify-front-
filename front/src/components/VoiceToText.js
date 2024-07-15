// src/VoiceToText.js
import React, { useState, useEffect } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const VoiceToText = ({
  onTextCaptured,
  isListening,
  setIsListening,
  children,
}) => {
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += result + " ";
        } else {
          interimTranscript += result;
        }
      }

      setTranscript(transcript + interimTranscript); // Append to existing transcript
      onTextCaptured(transcript + interimTranscript); // Capture all transcripts
    };

    recognition.onend = () => {
      setIsListening(false);
      // Automatically restart listening if still supposed to be listening
      if (isListening) {
        recognition.start();
      }
    };

    recognition.onerror = (event) => {
      console.error("SpeechRecognition error detected: ", event.error);
      setIsListening(false);
      recognition.stop();
    };

    return () => {
      recognition.stop();
    };
  }, [isListening, onTextCaptured, setIsListening, transcript]);

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return (
    <div onClick={isListening ? stopListening : startListening}>{children}</div>
  );
};

export default VoiceToText;

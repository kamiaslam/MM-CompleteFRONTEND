
import React, { useEffect, useRef, useState } from "react";
// Use relative paths to assets stored in the 'public' folder or an assets folder.
import micOff from "./assets/black-microphone-sound-off-14638.svg";
import micOn from "./assets/microphone-342.svg";
// Update paths to assets as relative imports
import Callingperson from "./assets/callingperson.jfif";
import Cutcallimage from "./assets/callcut.png";
import Acceptcallimage from "./assets/acceptcall.png";
import "./styles/callStyles.css"
import { useNavigate } from 'react-router-dom';
const CallPopupNew = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const OnCallDecline = () => {
    // Navigate to the /dashboard route
    navigate("/dashboard");
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create a MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const socket = new WebSocket("ws://192.168.100.49:8000/ws");
      socketRef.current = socket;

      // Wait for WebSocket connection
      await new Promise((resolve, reject) => {
        socket.onopen = () => {
          console.log("WebSocket connection established");
          resolve();
        };
        socket.onerror = (error) => {
          console.error("WebSocket connection error:", error);
          reject(error);
        };
      });

      // Listen for backend messages
      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.audio) {
          console.log("Received audio data:", data.audio.length);
          setIsLoading(true);

          const audioBlob = base64ToBlob(data.audio, "audio/wav");
          if (audioRef.current) {
            const audioUrl = URL.createObjectURL(audioBlob);
            // Use hidden audio element for playback
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          }
          setIsLoading(false);
        }
      };

      // When data is available, send it to the backend
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      };

      // Start sending data every second
      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setIsMuted(false); // ensure call starts unmuted
    } catch (error) {
      console.error("Error accessing microphone or starting WebSocket:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (socketRef.current) socketRef.current.close();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // Toggle mute/unmute without ending the call
  const toggleMute = () => {
    if (mediaRecorderRef.current) {
      if (!isMuted && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.pause();
        setIsMuted(true);
        console.log("Microphone muted");
      } else if (isMuted && mediaRecorderRef.current.state === "paused") {
        mediaRecorderRef.current.resume();
        setIsMuted(false);
        console.log("Microphone unmuted");
      }
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
  };

  return (
    <div className="callmodel-container">
      <div className="card">
        <div className="card-main-box">
          { !isRecording ? (
            // Incoming Call UI
            <>
              <div className="callpopup-header">
                <div className="calling-person-div-with-ring">
                  <div className="calling-person-div-with-ring-image">
                    <img src={Callingperson} alt="Calling Person" />
                  </div>
                </div>
                <p className="calling">Please pick up the call...</p>
              </div>
              <div className="callpopup-footer ">
                <div className="call-button cut-call" onClick={OnCallDecline}>
                  <span className="icon red">
                    <img src={Cutcallimage} alt="Decline Call" />
                  </span>
                </div>
                <div>
                  
                </div>
                <div className="call-button receive-call" onClick={startRecording}>
                  <span className="icon green">
                    <img src={Acceptcallimage} alt="Accept Call" />
                  </span>
                </div>
              </div>
            </>
          ) : (
            // Call in Progress UI
            <>
              <div className="callpopup-header ">
                <div className="calling-person-div-with-ring">
                  <div className="calling-person-div-with-ring-image">
                    <img src={Callingperson} alt="Calling Person" />
                  </div>
                </div>
                <p className="calling">Call in Progress...</p>
              </div>
              <div className="callpopup-footer in-progress">
                {/* Left button: Mute/Unmute */}

                <div className="call-button mic " onClick={toggleMute}>
                  <span className="icon green">
                    <img
                      src={isMuted ? micOff : micOn }
                      alt={isMuted ? "Unmute" : "Mute"}
                    />
                  </span>
                </div>
                {/* Right button: End Call */}
                <div className="call-button " onClick={stopRecording}>
                  <span className="icon red">
                    <img src={Cutcallimage} alt="End Call" />
                  </span>
                </div>
              </div>
              {/* Hidden audio element for playing backend responses */}
              <audio ref={audioRef} style={{ display: "none" }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallPopupNew;


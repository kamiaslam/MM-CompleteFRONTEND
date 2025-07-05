import React, { useEffect, useRef, useState } from "react";
import micOff from "../assets/black-microphone-sound-off-14638.svg";
import micOn from "../assets/microphone-342.svg";
import Callingperson from "../assets/callingperson.jfif";
import Cutcallimage from "../assets/callcut.png";
import Acceptcallimage from "../assets/acceptcall.png";
import VoiceReactiveSpeaker from "./neonVisulizer";

const CallPopupNew = ({ email, logout }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [displayTime, setDisplayTime] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState("prompt1"); // 👈 added

  const voiceOptions = [
    { name: "Aria", id: "9BWtsMINqrJLrRacOk9x" },
    { name: "Roger", id: "CwhRBWXzGAHq8TQ4Fs17" },
    { name: "Sarah", id: "EXAVITQu4vr4xnSDxMaL" },
    { name: "Laura", id: "FGY2WhTYpPnrIDTdsKH5" },
    { name: "Charlie", id: "IKne3meq5aSn9XLyUdCD" },
    { name: "George", id: "JBFqnCBsd6RMkjVDRZzb" },
    { name: "Callum", id: "N2lVS1w4EtoT3dr4eOWO" },
    { name: "River", id: "SAz9YHcvj6GT2YYXdXww" },
    { name: "Liam", id: "TX3LPaxmHKxFdv7VOQHJ" },
    { name: "Charlotte", id: "XB0fDUnXU5powFXDhCwa" },
    { name: "Alice", id: "Xb7hH8MSUJpSbSDYk0k2" },
    { name: "Matilda", id: "XrExE9yKIg1WjnnlVkGX" },
    { name: "Will", id: "bIHbv24MWmeRgasZH58o" },
    { name: "Jessica", id: "cgSgspJ2msm6clMCkdW9" },
    { name: "Eric", id: "cjVigY5qzO86Huf0OWal" },
    { name: "Chris", id: "iP95p4xoKVk53GoZ742B" },
    { name: "Brian", id: "nPczCjzI2devNBz1zQrb" },
    { name: "Daniel", id: "onwK4e9ZLuTAKqWW03F9" },
    { name: "Lily", id: "pFZP5JQG7iQjIQuC4Bku" },
    { name: "Bill", id: "pqHfZKP75CvOlQylNhV4" },
    { name: "Lewis - Calm Scottish Male", id: "gUbIduqGzBP438teh4ZA" },
  ];

  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[1]); // Default: Roger


  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioRef = useRef(null);
  const countdownInterval = useRef(null);

  const userEmail = email;

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  const startCountdown = (timeInSeconds) => {
    setDisplayTime(timeInSeconds);
    countdownInterval.current = setInterval(() => {
      setDisplayTime((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(countdownInterval.current);
          countdownInterval.current = null;
          stopRecording(0);
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const socket = new WebSocket(
        `wss://mindmeta-backend-demo-bot-speech-to-speech-hrbtazh7c6ghewe2.uksouth-01.azurewebsites.net/api/demo-bot-call/call-with-demo-bot?email=${userEmail}&prompt=${selectedPrompt}&voice_id=${selectedVoice.id}`
      );

      socketRef.current = socket;

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
      socket.onclose = () => {
        console.warn("WebSocket connection closed unexpectedly.");
        stopRecording(); 
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.remaining_time !== undefined) {
            setRemainingTime(data.remaining_time);
            startCountdown(data.remaining_time);
            return;
          }

          if (data.type === "intruption") {
            // show intrup in console here 
            console.warn("Received 'intruption' message");
            if (audioRef.current && !audioRef.current.paused) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            console.warn("Received 'intruption' message");
            return;
          }

          if (data.audio) {
            setIsLoading(true);
            const audioBlob = base64ToBlob(data.audio, "audio/wav");
            const audioUrl = URL.createObjectURL(audioBlob);

            if (audioRef.current) {
              try {
                if (!audioRef.current.paused) {
                  audioRef.current.pause();
                }
                audioRef.current.currentTime = 0;
              } catch (pauseError) {
                console.warn("Audio pause error:", pauseError);
              }

              audioRef.current.src = audioUrl;

              try {
                await audioRef.current.play();
              } catch (playError) {
                console.warn("Audio play error:", playError.message);
              }
            }

            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setIsMuted(false);
    } catch (error) {
      console.error("Error accessing microphone or starting WebSocket:", error);
    }
  };

  const stopRecording = async (overrideTime = null) => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (socketRef.current) socketRef.current.close();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }

    const timeToSend = overrideTime !== null ? overrideTime : displayTime;

    if (timeToSend !== null) {
      try {
        const response = await fetch("https://mindmeta-backend-demo-bot-speech-to-speech-hrbtazh7c6ghewe2.uksouth-01.azurewebsites.net/call-with-bot-end", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            time: timeToSend,
            email: userEmail,
          }),
        });

        if (!response.ok) {
          console.error("Failed to send remaining time:", await response.text());
        } else {
          console.log("Remaining time sent successfully");
        }
      } catch (error) {
        console.error("Error sending remaining time:", error);
      }
    }
  };

  const toggleMute = () => {
    if (mediaRecorderRef.current) {
      if (!isMuted && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.pause();
        setIsMuted(true);
      } else if (isMuted && mediaRecorderRef.current.state === "paused") {
        mediaRecorderRef.current.resume();
        setIsMuted(false);
      }
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
  };

  return (
    <div className="callmodel-container">
      {/* Sticky prompt buttons */}
      

      <div className="card">
        <div className="card-main-box">
          {!isRecording ? (
            <>
              <button
                onClick={logout}
                className="logout-button"
              >
                Logout
              </button>
              <div className="callpopup-header">
                <div className="calling-person-div-with-ring">
                  <div className="calling-person-div-with-ring-image">
                    <img src={Callingperson} alt="Calling Person" />
                  </div>
                </div>
                <p className="calling">Please pick up the call...</p>
              </div>
              <div className="callpopup-footer2">
                <div className="call-button receive-call" onClick={startRecording}>
                  <span className="icon green">
                    <img src={Acceptcallimage} alt="Accept Call" />
                  </span>
                </div>
              </div>
              <div className="prompt-button-group">
                {["prompt1", "prompt2", "prompt3"].map((prompt) => (
                  <button
                    key={prompt}
                    className={`prompt-button ${selectedPrompt === prompt ? "selected" : ""}`}
                    onClick={() => setSelectedPrompt(prompt)}
                    disabled={isRecording}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="voice-dropdown-container">
                <label htmlFor="voice-select">🎤 Voice:</label>
                <select
                  id="voice-select"
                  value={selectedVoice.id}
                  onChange={(e) => {
                    const selected = voiceOptions.find(v => v.id === e.target.value);
                    setSelectedVoice(selected);
                  }}
                  disabled={isRecording}
                >
                  {voiceOptions.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>




            </>
          ) : (
            <>
              <div className="callpopup-header">
                {mediaStreamRef.current && (
                  <VoiceReactiveSpeaker stream={mediaStreamRef.current} />
                )}
                {displayTime !== null && (
                  <div className="remaining-time-display">
                    ⏳ Time remaining: {displayTime}s
                  </div>
                )}
              </div>

              <div className="callpopup-footer in-progress">
                <div className="call-button mic" onClick={toggleMute}>
                  <span className="icon green">
                    <img
                      src={isMuted ? micOff : micOn}
                      alt={isMuted ? "Unmute" : "Mute"}
                    />
                  </span>
                </div>
                <div className="call-button" onClick={() => stopRecording()}>
                  <span className="icon red">
                    <img src={Cutcallimage} alt="End Call" />
                  </span>
                </div>
              </div>
              <audio ref={audioRef} style={{ display: "none" }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallPopupNew;
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const CALL_STATES = {
  INCOMING: 'INCOMING',
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  DECLINED: 'DECLINED',
  IDLE: 'IDLE',
};

const useCallPopupLogic = ({ Patient_id, callPreData, callId, onClose, audioRef }) => {
  const [callState, setCallState] = useState(CALL_STATES.IDLE);
  const [isLoading, setIsLoading] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const socketRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    console.log("call predata", callPreData);
    setCallState(CALL_STATES.INCOMING);

    return () => {
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      socketRef.current.close(1000, "Cleanup resources");
    }
  };

  const base64ToBlob = (base64, mime) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mime });
  };

  const acceptCall = async () => {
    try {
      setCallState(CALL_STATES.CONNECTING);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const socket = new WebSocket(
        `${import.meta.env.VITE_CALL_WS_URL}/api/call/call-with-bot?patient_id=${Patient_id}&voice_id=${callPreData.voice_id}&patient_name=Test&carehome_id=${callPreData.carehome_id}`
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

      socket.onclose = (event) => {
        console.warn(
          `WebSocket closed. Code: ${event.code}, Reason: "${event.reason || 'No reason'}"`
        );
        // Avoid calling cleanup here to prevent premature stop
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "intruption") {
            console.warn("Received 'intruption' message");
            if (audioRef.current && !audioRef.current.paused) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
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
                audioRef.current.onended = () => {
                  URL.revokeObjectURL(audioUrl);
                };
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

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        } else {
          console.warn(
            "Data not sent. Size:", event.data.size, 
            "Socket readyState:", socket.readyState
          );
        }
      };

      mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped. Closing WebSocket...");
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close(1000, "Recorder stopped");
        }
      };

      mediaRecorder.start(1000);

      setCallState(CALL_STATES.ACTIVE);
    } catch (error) {
      console.error("Error during call acceptance:", error);
      cleanupResources();
      toast.error("Oops! Failed to establish call connection.")
      setCallState(CALL_STATES.IDLE);
      endCall();
    }
  };

  const declineCall = () => {
    endCall();
    setCallState(CALL_STATES.DECLINED);
  };

  const endCall = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      socketRef.current.close(1000, "Call ended");
      socketRef.current = null;
    }

    if (audioRef.current) {
      try {
        URL.revokeObjectURL(audioRef.current.src);
      } catch (e) {
        console.warn("Error revoking audio URL:", e);
      }
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    setIsLoading(false);
    setIsMicOn(true);
    setCallState(CALL_STATES.IDLE);

    onClose?.();
  };

  const toggleMic = () => {
    const stream = mediaStreamRef.current;
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsMicOn(track.enabled);
      });
    }
  };

  return {
    callState,
    acceptCall,
    declineCall,
    endCall,
    callPreData,
    Patient_id,
    callId,
    isLoading,
    mediaStream: mediaStreamRef.current,
    isMicOn,
    toggleMic,
  };
};

export default useCallPopupLogic;

import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export const CALL_STATES = {
  IDLE: "idle",
  INCOMING: "incoming",
  CONNECTING: "connecting",
  ACTIVE: "active",
  DECLINED: "declined",
};

const useCallPopupLogic = ({ Patient_id, callPreData, callId, onClose, audioRef }) => {
  const [callState, setCallState] = useState(CALL_STATES.IDLE);
  const [isLoading, setIsLoading] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const socketRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  // Audio Queue Management
  const audioQueue = useRef([]);
  const currentAudioElement = useRef(null);
  const isPlaying = useRef(false);
  const lastSequenceNumber = useRef(0);
  const audioChunks = useRef(new Map()); // Store audio chunks by chunk_id
  const audioUrls = useRef(new Set()); // Track created object URLs for cleanup

  useEffect(() => {
    setCallState(CALL_STATES.INCOMING);

    return () => {
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    // Clean up audio resources
    clearAudioQueue();
    stopCurrentAudio();
    
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

  // Audio Queue Management Functions
  const clearAudioQueue = () => {
    const queueLength = audioQueue.current.length;
    audioQueue.current = [];
    audioChunks.current.clear();
    lastSequenceNumber.current = 0;
  };

  const stopCurrentAudio = () => {
    if (currentAudioElement.current) {
      try {
        currentAudioElement.current.pause();
        currentAudioElement.current.currentTime = 0;
        currentAudioElement.current = null;
      } catch (error) {
        console.warn("Error stopping current audio:", error);
      }
    }
    isPlaying.current = false;
  };

  const cleanupAudioUrl = (url) => {
    if (url && audioUrls.current.has(url)) {
      URL.revokeObjectURL(url);
      audioUrls.current.delete(url);
    }
  };

  const cleanupAllAudioUrls = () => {
    const urlCount = audioUrls.current.size;
    audioUrls.current.forEach(url => {
      URL.revokeObjectURL(url);
    });
    audioUrls.current.clear();
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

  const createAudioElement = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    return audio;
  };

  const playAudioChunk = async (audioChunk) => {
    try {
      const { audio: base64Audio, chunk_id, sequence_number, play_immediately, wait_for_previous, stop_previous } = audioChunk;
      
     
      // Handle wait_for_previous flag
      if (wait_for_previous && isPlaying.current) {
        console.log(`Waiting for previous audio to finish before playing chunk ${chunk_id}`);
        return; // Don't play yet, it will be handled by the queue
      }

      // Convert base64 to blob and create URL
      const audioBlob = base64ToBlob(base64Audio, "audio/wav");
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrls.current.add(audioUrl);

      // Create and play audio element
      const audioElement = createAudioElement(audioUrl);
      currentAudioElement.current = audioElement;
      isPlaying.current = true;

      // Set up audio event handlers
      audioElement.onended = () => {
        cleanupAudioUrl(audioUrl);
        isPlaying.current = false;
        currentAudioElement.current = null;
        
        // Process next item in queue
        processAudioQueue();
      };

      audioElement.onerror = (error) => {
        console.error(`Error playing audio chunk ${chunk_id}:`, error);
        cleanupAudioUrl(audioUrl);
        isPlaying.current = false;
        currentAudioElement.current = null;
        processAudioQueue();
      };

      // Play the audio
      await audioElement.play();

    } catch (error) {
      console.error("Error playing audio chunk:", error);
      isPlaying.current = false;
      currentAudioElement.current = null;
      processAudioQueue();
    }
  };

  const processAudioQueue = () => {
    if (isPlaying.current || audioQueue.current.length === 0) {
      return;
    }

    // Sort queue by sequence number
    audioQueue.current.sort((a, b) => a.sequence_number - b.sequence_number);
    
    // Find the next chunk to play
    const nextChunk = audioQueue.current.find(chunk => 
      chunk.sequence_number > lastSequenceNumber.current
    );

    if (nextChunk) {
      audioQueue.current = audioQueue.current.filter(chunk => chunk !== nextChunk);
      lastSequenceNumber.current = nextChunk.sequence_number;
      playAudioChunk(nextChunk);
    }
  };

  const handleAudioChunk = (data) => {
    const { 
      audio, 
      chunk_id, 
      sequence_number, 
      play_immediately, 
      wait_for_previous, 
      stop_previous, 
      interrupt 
    } = data;



    // Handle interrupt flag
    if (interrupt) {
      stopCurrentAudio();
      clearAudioQueue();
      cleanupAllAudioUrls();
      setIsLoading(false);
      return;
    }

    // Create audio chunk object
    const audioChunk = {
      audio,
      chunk_id,
      sequence_number,
      play_immediately,
      wait_for_previous,
      stop_previous
    };

    // Store chunk for potential reordering
    audioChunks.current.set(chunk_id, audioChunk);

    // ALWAYS wait for previous audio to complete (ignore all flags except interrupt)
    if (isPlaying.current) {
      audioQueue.current.push(audioChunk);
    } else {
      playAudioChunk(audioChunk);
    }
  };

  const acceptCall = async () => {
    try {
      setCallState(CALL_STATES.CONNECTING);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const socket = new WebSocket(
        `${import.meta.env.VITE_CALL_WS_URL}/api/call/call-with-bot?patient_id=${Patient_id}&voice_id=${callPreData.voice_id}&patient_name=Test&carehome_id=${callPreData.carehome_id}&provider=${callPreData.provider_id}`
      );
      socketRef.current = socket;

      await new Promise((resolve, reject) => {
        socket.onopen = () => {
          resolve();
        };
        socket.onerror = (error) => {
          reject(error);
        };
      });

      socket.onclose = (event) => {
        console.warn(
          `WebSocket closed. Code: ${event.code}, Reason: "${event.reason || 'No reason'}"`
        );
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle interruption messages (check both interrupt flag and type)
          if (data.interrupt || data.type === "interruption" || data.type === "intruption") {
            console.warn("Received interruption message - stopping all audio");
            stopCurrentAudio();
            clearAudioQueue();
            cleanupAllAudioUrls();
            setIsLoading(false);
            return;
          }

          // Handle audio chunks
          if (data.audio) {
            setIsLoading(true);
            handleAudioChunk(data);
            setIsLoading(false);
            return;
          }

          // Handle other message types

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
    // Clean up all audio resources
    stopCurrentAudio();
    clearAudioQueue();
    cleanupAllAudioUrls();
    
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
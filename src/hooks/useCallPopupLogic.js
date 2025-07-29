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
  
  // WebSocket and Media Stream
  const socketRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  // Simple Audio Management
  const currentAudioRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const urlsToCleanupRef = useRef(new Set());

  // Background Music Management
  const backgroundMusicRef = useRef(null);
  const backgroundMusicVolume = 0.03;
  const backgroundMusicTracks = {
    '/celebration': '/assets/backgroundMusic/ES_Celebration01.mp3',
    '/story_music': '/assets/backgroundMusic/ES_Frosted Dawn - Megan Wofford.mp3',
    '/ambient_morning': '/assets/backgroundMusic/ES_Birds, Distant - Morning.mp3',
    '/ambient_evening': '/assets/backgroundMusic/ES_Beach Waves - Night.mp3',
    '/emotion_meditation_soft': '/assets/backgroundMusic/ES_In a Quiet Room - DEX 1200.mp3'
  };

  // Speech Detection
  const isUserSpeakingRef = useRef(false);
  const speechContextRef = useRef(null);
  const processorRef = useRef(null);

  // Audio Playback Context for better quality
  const playbackContextRef = useRef(null);
  const currentAudioSourceRef = useRef(null);

  useEffect(() => {
    setCallState(CALL_STATES.INCOMING);
    return () => cleanup();
  }, []);

  // Simple function to stop all audio immediately
  const stopAllAudio = () => {
    console.log('🛑 Stopping all audio immediately');
    
    // Stop current audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    
    // Stop current audio (AudioContext)
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
        currentAudioSourceRef.current.disconnect();
        currentAudioSourceRef.current = null;
      } catch (error) {
        console.warn('Error stopping audio source:', error);
      }
    }
    
    // Stop background music
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.src = '';
        backgroundMusicRef.current = null;
      }

    // Clear queue
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    
    // Cleanup URLs
    urlsToCleanupRef.current.forEach(url => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Error revoking URL:', error);
      }
    });
    urlsToCleanupRef.current.clear();
  };

  // High-quality AudioContext playback function
  const playAudioWithContext = async (audioBlob) => {
    try {
      // Create playback context if needed
      if (!playbackContextRef.current || playbackContextRef.current.state === 'closed') {
        playbackContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Resume context if suspended
      if (playbackContextRef.current.state === 'suspended') {
        await playbackContextRef.current.resume();
      }
      
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await playbackContextRef.current.decodeAudioData(arrayBuffer);
      
      console.log(`🎵 AudioContext decoded: duration=${audioBuffer.duration}s, sampleRate=${audioBuffer.sampleRate}Hz, channels=${audioBuffer.numberOfChannels}`);
      
      const source = playbackContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(playbackContextRef.current.destination);
      
      currentAudioSourceRef.current = source;
      
      source.onended = () => {
        console.log('🔚 AudioContext playback ended');
        isPlayingRef.current = false;
        currentAudioSourceRef.current = null;
        setTimeout(playNext, 50);
      };
      
      source.start(0);
      console.log('▶️ AudioContext playback started');
      return true;
      
    } catch (error) {
      console.error('❌ AudioContext playback failed:', error);
      return false;
    }
  };

  // Simple function to play next audio in queue
  const playNext = async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    const item = audioQueueRef.current.shift();
    if (!item) return;

    console.log(`▶️ Playing: ${item.type}`);
    isPlayingRef.current = true;

    // Try AudioContext first for better quality
    try {
      const response = await fetch(item.url);
      const audioBlob = await response.blob();
      
      const audioContextSuccess = await playAudioWithContext(audioBlob);
      if (audioContextSuccess) {
        return;
      }
      } catch (error) {
      console.warn('AudioContext failed, falling back to HTML5 Audio:', error);
    }

    // Fallback to HTML5 Audio
    const audio = new Audio(item.url);
    currentAudioRef.current = audio;
    audio.volume = 1.0;
    
    // Set audio properties for better quality
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    
    // Log audio properties for debugging
    audio.addEventListener('loadedmetadata', () => {
      console.log(`🎵 HTML5 Audio loaded: duration=${audio.duration}s, sampleRate=${audio.sampleRate || 'unknown'}, volume=${audio.volume}`);
    });

    audio.onended = () => {
      console.log('🔚 HTML5 Audio ended');
      isPlayingRef.current = false;
      currentAudioRef.current = null;
      setTimeout(playNext, 50);
    };

    audio.onerror = (error) => {
      console.error('❌ HTML5 Audio error:', error);
      isPlayingRef.current = false;
      currentAudioRef.current = null;
      setTimeout(playNext, 50);
    };

    audio.play().catch(error => {
      console.error('❌ Failed to play HTML5 Audio:', error);
      isPlayingRef.current = false;
      currentAudioRef.current = null;
      setTimeout(playNext, 50);
    });
  };

  // Simple function to add audio to queue
  const addToQueue = (audioBlob, type = 'audio') => {
    console.log(`🎵 Adding to queue: type=${type}, size=${audioBlob.size} bytes, mime=${audioBlob.type}`);
    const url = URL.createObjectURL(audioBlob);
    urlsToCleanupRef.current.add(url);
    
    audioQueueRef.current.push({ url, type });
    
    if (!isPlayingRef.current) {
      playNext();
    }
  };

  // Simple background music function
  const startBackgroundMusic = (path = '/ambient_morning') => {
    const musicUrl = backgroundMusicTracks[path];
    if (!musicUrl) {
      console.warn(`🎵 Unknown background music path: ${path}`);
      return;
    }

    console.log(`🎵 Starting background music: ${path}`);
    
    // Stop existing background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    }

    backgroundMusicRef.current = new Audio(musicUrl);
    backgroundMusicRef.current.volume = backgroundMusicVolume;
    backgroundMusicRef.current.loop = true;

    backgroundMusicRef.current.play().catch(error => {
      console.error('❌ Failed to start background music:', error);
    });
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.src = '';
      backgroundMusicRef.current = null;
      console.log('🔇 Background music stopped');
    }
  };

  // Simple speech detection
  const startSpeechDetection = (stream) => {
    try {
      if (!speechContextRef.current || speechContextRef.current.state === 'closed') {
        speechContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const sourceNode = speechContextRef.current.createMediaStreamSource(stream);
      const processor = speechContextRef.current.createScriptProcessor(4096, 1, 1);
      sourceNode.connect(processor);
      processor.connect(speechContextRef.current.destination);
      
      processor.onaudioprocess = (evt) => {
        const input = evt.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < input.length; i++) sum += Math.abs(input[i]);
        const avg = sum / input.length;
        
                if (avg > 0.1 && !isUserSpeakingRef.current) {
          isUserSpeakingRef.current = true;
          console.log('🎤 User started speaking - stopping all audio');
          stopAllAudio();
          stopBackgroundMusic();
        } else if (avg < 0.05 && isUserSpeakingRef.current) {
          isUserSpeakingRef.current = false;
          console.log('🤫 User stopped speaking');
        }
      };
      
      processorRef.current = processor;
      
    } catch (error) {
      console.warn('Speech detection setup failed:', error);
    }
  };

  const stopSpeechDetection = () => {
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
        processorRef.current = null;
      } catch (error) {
        console.warn('Error disconnecting processor:', error);
      }
    }
    
    if (speechContextRef.current && speechContextRef.current.state !== 'closed') {
      try {
        speechContextRef.current.close();
        speechContextRef.current = null;
      } catch (error) {
        console.warn('Error closing speech context:', error);
      }
    }
    
    isUserSpeakingRef.current = false;
  };

  const base64ToBlob = (base64, mime = 'audio/webm;codecs=opus') => {
    try {
      const base64Data = base64.replace(/^data:audio\/[^;]+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mime });
      
    } catch (error) {
      console.error('Error converting base64 to blob:', error);
      return null;
    }
  };

  const displayImage = (mediaUrl, mediaId, tag) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('call-media-frame', { 
        detail: { 
          mediaUrl, 
          type: 'image', 
          tag, 
          mediaId 
        } 
      }));
    }
  };

  const cleanup = () => {
    console.log('🧹 Starting cleanup');
    
    stopSpeechDetection();
    stopBackgroundMusic();
    stopAllAudio();
    
    // Close playback context
    if (playbackContextRef.current && playbackContextRef.current.state !== 'closed') {
      try {
        playbackContextRef.current.close();
        playbackContextRef.current = null;
    } catch (error) {
        console.warn('Error closing playback context:', error);
      }
    }
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.warn('Error stopping media recorder:', error);
      }
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
    } catch (error) {
          console.warn('Error stopping track:', error);
        }
      });
    }
    
    // Close WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    
    console.log('✅ Cleanup completed');
  };

  const acceptCall = async () => {
    try {
      setCallState(CALL_STATES.CONNECTING);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Start speech detection
      startSpeechDetection(stream);

      // Create WebSocket connection
      const socket = new WebSocket(
        `${import.meta.env.VITE_CALL_WS_URL}/api/hume-call/call-with-hume?patient_id=${Patient_id}&voice_id=${callPreData.voice_id}&patient_name=Test&carehome_id=${callPreData.carehome_id}&provider=${callPreData.provider_id}&call_schedule_id=${callId || callPreData.call_schedule_id || ''}`
      );
      socketRef.current = socket;

      // Wait for connection
      await new Promise((resolve, reject) => {
        socket.onopen = resolve;
        socket.onerror = reject;
      });

      // Handle WebSocket close
      socket.onclose = (event) => {
        console.warn('WebSocket closed:', event.code, event.reason);
        stopBackgroundMusic();
        endCall();
      };

      // Handle incoming messages
      socket.onmessage = async (event) => {
        try {
          // Handle binary data (audio/media)
          if (event.data instanceof Blob) {
            // don't re-encode—use original blob with its real type
            addToQueue(event.data, 'audio');
            return;
          }

          // Handle ArrayBuffer
          if (event.data instanceof ArrayBuffer) {
            const audioBlob = new Blob([event.data]);
            addToQueue(audioBlob, 'audio');
            return;
          }

          // Handle JSON messages
          const data = JSON.parse(event.data);

          // Handle interruption
          if (data.interrupt || data.type === "interruption") {
            console.log('🚨 Received server interruption - stopping all audio');
            stopAllAudio();
            return;
          }

          // Handle background music
          if (data.type === "background_music" && data.path) {
            console.log(`🎵 Received background music: ${data.path}`);
            startBackgroundMusic(data.path);
            return;
          }

          // Handle media metadata
          if (data.media_meta) {
            const { type, id, tag, mediatype } = data.media_meta;
            
            if (data.data_b64) {
              const mediaBlob = base64ToBlob(data.data_b64, mediatype);
              if (mediaBlob) {
                const mediaUrl = URL.createObjectURL(mediaBlob);
                urlsToCleanupRef.current.add(mediaUrl);
                
                if (type === 'image') {
                  displayImage(mediaUrl, id, tag);
                } else {
                  addToQueue(mediaBlob, type);
                }
              }
            }
            return;
          }

          // Handle audio chunks
          if (data.audio) {
            setIsLoading(true);
            const audioBlob = base64ToBlob(data.audio, 'audio/webm;codecs=opus');
            if (audioBlob) {
              addToQueue(audioBlob, 'audio');
            }
            setIsLoading(false);
            return;
          }

        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('🔴 MediaRecorder stopped');
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };

      mediaRecorder.start(1000);
      setCallState(CALL_STATES.ACTIVE);

    } catch (error) {
      console.error('Error during call acceptance:', error);
      cleanup();
      toast.error("Failed to establish call connection.");
      setCallState(CALL_STATES.IDLE);
      onClose?.();
    }
  };

  const declineCall = () => {
    endCall();
    setCallState(CALL_STATES.DECLINED);
  };

  const endCall = () => {
    cleanup();
    setCallState(CALL_STATES.IDLE);
    setIsLoading(false);
    setIsMicOn(true);
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
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
  
  // Enhanced Audio Management with real-time interruption
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const urlsToCleanupRef = useRef(new Set());
  const shouldInterruptRef = useRef(false); // New: interruption flag
  
  // High-quality audio context management
  const audioContextRef = useRef(null);
  const currentAudioSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

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

  useEffect(() => {
    setCallState(CALL_STATES.INCOMING);
    return () => cleanup();
  }, []);

  // Utility: Convert PCM to WAV Blob
  function pcmToWav(pcmData, sampleRate = 16000, numChannels = 1, bitDepth = 16) {
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const wavBuffer = new ArrayBuffer(44 + pcmData.length);
    const view = new DataView(wavBuffer);

    // RIFF identifier 'RIFF'
    view.setUint32(0, 0x52494646, false);
    // file length minus RIFF identifier length and file description length
    view.setUint32(4, 36 + pcmData.length, true);
    // RIFF type 'WAVE'
    view.setUint32(8, 0x57415645, false);
    // format chunk identifier 'fmt '
    view.setUint32(12, 0x666d7420, false);
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, numChannels, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, byteRate, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, blockAlign, true);
    // bits per sample
    view.setUint16(34, bitDepth, true);
    // data chunk identifier 'data'
    view.setUint32(36, 0x64617461, false);
    // data chunk length
    view.setUint32(40, pcmData.length, true);

    // Write PCM samples
    new Uint8Array(wavBuffer, 44).set(pcmData);

    return new Blob([wavBuffer], { type: 'audio/wav; codecs=1' });
  }

  // Initialize high-quality audio context
  const initializeAudioContext = async () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000, // Match PCM/WAV sample rate
        latencyHint: 'interactive' // Low latency for real-time
      });
      
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  // Real-time interruption function
  const executeImmediateInterruption = () => {
    console.log('🚨 IMMEDIATE INTERRUPTION - stopping all audio NOW');
    
    // Set interruption flag
    shouldInterruptRef.current = true;
    
    // Stop current AudioContext source immediately
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop(0); // Stop immediately
        currentAudioSourceRef.current.disconnect();
        currentAudioSourceRef.current = null;
      } catch (error) {
        console.warn('Error stopping audio source:', error);
      }
    }
    
    // Stop background music immediately
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    
    // Clear the entire queue
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    
    // Clean up URLs
    urlsToCleanupRef.current.forEach(url => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Error revoking URL:', error);
      }
    });
    urlsToCleanupRef.current.clear();
    
    console.log('✅ Immediate interruption completed');
  };

  // Enhanced high-quality audio playback
  const playAudioWithEnhancedQuality = async (audioBlob) => {
    try {
      // Check for interruption before starting
      if (shouldInterruptRef.current) {
        console.log('🚫 Skipping audio due to interruption flag');
        return false;
      }

      await initializeAudioContext();
      
      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      // Decode with high quality settings
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      console.log(`🎵 High-quality audio: duration=${audioBuffer.duration}s, sampleRate=${audioBuffer.sampleRate}Hz, channels=${audioBuffer.numberOfChannels}`);
      
      // Check for interruption after decoding
      if (shouldInterruptRef.current) {
        console.log('🚫 Interruption detected after decoding, aborting playback');
        return false;
      }
      
      // Create buffer source
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      // Connect through gain node for better control
      source.connect(gainNodeRef.current);
      
      // Set high-quality playback parameters
      source.playbackRate.value = 1.0; // Ensure normal speed
      gainNodeRef.current.gain.value = 1.0; // Full volume
      
      currentAudioSourceRef.current = source;
      
      // Handle end event
      source.onended = () => {
        console.log('🔚 High-quality audio ended');
        currentAudioSourceRef.current = null;
        isPlayingRef.current = false;
        
        // Reset interruption flag and continue queue
        shouldInterruptRef.current = false;
          setTimeout(playNext, 50);
      };
      
      // Start playback
      source.start(0);
      console.log('▶️ High-quality audio started');
      return true;
      
    } catch (error) {
      console.error('❌ High-quality audio playback failed:', error);
      shouldInterruptRef.current = false;
      return false;
    }
  };

  // Enhanced queue processing with interruption checks
  const playNext = async () => {
    // Check interruption flag
    if (shouldInterruptRef.current) {
      console.log('🚫 Queue processing stopped due to interruption');
      return;
    }

    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    const item = audioQueueRef.current.shift();
    if (!item) return;

    console.log(`▶️ Playing: ${item.type}`);
    isPlayingRef.current = true;

    // Try high-quality AudioContext playback
    try {
      const response = await fetch(item.url);
          
          // Check interruption after fetch
      if (shouldInterruptRef.current) {
        console.log('🚫 Interruption detected after fetch, aborting');
        isPlayingRef.current = false;
            return;
          }
          
      const audioBlob = await response.blob();
      
      // Ensure we have the right MIME type for quality
      const properBlob = new Blob([audioBlob], { 
        type: audioBlob.type || 'audio/webm;codecs=opus' 
      });
      
      const success = await playAudioWithEnhancedQuality(properBlob);
      if (success) {
            return;
          }
    } catch (error) {
      console.warn('Enhanced audio failed, this should not happen with Hume:', error);
      isPlayingRef.current = false;
      shouldInterruptRef.current = false;
            setTimeout(playNext, 50);
    }
  };

  // Enhanced queue addition with better blob handling
  const addToQueue = (audioBlob, type = 'audio') => {
    // Skip if interrupted
    if (shouldInterruptRef.current) {
      console.log('🚫 Skipping queue addition due to interruption');
            return;
          }
          
    console.log(`🎵 Adding to queue: type=${type}, size=${audioBlob.size} bytes, mime=${audioBlob.type}`);
    
    // Create URL with proper cleanup tracking
    const url = URL.createObjectURL(audioBlob);
    urlsToCleanupRef.current.add(url);
    
    audioQueueRef.current.push({ url, type, blob: audioBlob });
    
    if (!isPlayingRef.current) {
      playNext();
    }
  };

  // Enhanced background music with quality settings
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
    
    // Set audio quality properties
    backgroundMusicRef.current.preload = 'auto';
    backgroundMusicRef.current.crossOrigin = 'anonymous';

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

  // Enhanced speech detection with better sensitivity
  const startSpeechDetection = (stream) => {
    try {
      if (!speechContextRef.current || speechContextRef.current.state === 'closed') {
        speechContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 48000,
          latencyHint: 'interactive'
        });
      }
      
      const sourceNode = speechContextRef.current.createMediaStreamSource(stream);
      const analyser = speechContextRef.current.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      
      sourceNode.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const checkAudioLevel = () => {
        if (speechContextRef.current?.state !== 'running') return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate RMS for better speech detection
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / bufferLength);
        
        // Enhanced speech detection threshold
        if (rms > 15 && !isUserSpeakingRef.current) { // Lowered threshold for better sensitivity
          isUserSpeakingRef.current = true;
          console.log('🎤 User started speaking - IMMEDIATE interruption');
          executeImmediateInterruption();
          stopBackgroundMusic();
        } else if (rms < 8 && isUserSpeakingRef.current) {
          isUserSpeakingRef.current = false;
          console.log('🤫 User stopped speaking');
          // Reset interruption flag after a short delay
          setTimeout(() => {
            shouldInterruptRef.current = false;
          }, 500);
        }
        
        requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();
      
    } catch (error) {
      console.warn('Enhanced speech detection setup failed:', error);
    }
  };

  const stopSpeechDetection = () => {
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

  // Enhanced base64 conversion with PCM/WAV detection
  const base64ToBlob = (base64, mime = 'audio/webm;codecs=opus') => {
    try {
      const base64Data = base64.replace(/^data:audio\/[^;]+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // PCM detection: If mime is PCM or unknown, wrap as WAV
      if (mime === 'audio/pcm' || mime === 'audio/raw' || mime === 'audio/L16' || mime === 'audio/x-pcm' || mime === 'audio/basic' || mime === 'audio/linear' || mime === 'audio/l16' || mime === 'audio/linear16' || mime === 'audio/linear16le' || mime === 'audio/linear16be' || mime === 'audio/linear8' || mime === 'audio/linear8le' || mime === 'audio/linear8be' || mime === 'audio/pcm;bit=16;rate=16000' || mime === 'audio/pcm;bit=16;rate=8000' || mime === 'audio/pcm;bit=16;rate=44100' || mime === 'audio/pcm;bit=16;rate=48000' || mime === 'audio/pcm;bit=16;rate=22050' || mime === 'audio/pcm;bit=16;rate=11025' || mime === 'audio/pcm;bit=8;rate=16000' || mime === 'audio/pcm;bit=8;rate=8000' || mime === 'audio/pcm;bit=8;rate=44100' || mime === 'audio/pcm;bit=8;rate=48000' || mime === 'audio/pcm;bit=8;rate=22050' || mime === 'audio/pcm;bit=8;rate=11025' || mime === 'audio/pcm;bit=8;rate=8000' || mime === 'audio/pcm;bit=8;rate=16000' || mime === 'audio/pcm;bit=8;rate=44100' || mime === 'audio/pcm;bit=8;rate=48000' || mime === 'audio/pcm;bit=8;rate=22050' || mime === 'audio/pcm;bit=8;rate=11025' || mime === 'audio/pcm' || mime === 'audio/x-wav' || mime === 'audio/wav' || mime === 'audio/wave' || mime === 'audio/x-pn-wav' || mime === 'audio/x-pcm' || mime === 'audio/x-raw' || mime === 'audio/x-linear' || mime === 'audio/x-linear16' || mime === 'audio/x-linear8' || mime === 'audio/x-linear16le' || mime === 'audio/x-linear16be' || mime === 'audio/x-linear8le' || mime === 'audio/x-linear8be' || mime === 'audio/x-basic' || mime === 'audio/x-l16' || mime === 'audio/x-linear16' || mime === 'audio/x-linear8' || mime === 'audio/x-linear16le' || mime === 'audio/x-linear16be' || mime === 'audio/x-linear8le' || mime === 'audio/x-linear8be') {
        // Default to 16kHz, 16-bit, mono
        return pcmToWav(byteArray, 16000, 1, 16);
      }

      // Otherwise, use the provided MIME type
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
    console.log('🧹 Starting enhanced cleanup');
    
    // Execute final interruption
    executeImmediateInterruption();
    
    stopSpeechDetection();
    stopBackgroundMusic();
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
        audioContextRef.current = null;
        gainNodeRef.current = null;
      } catch (error) {
        console.warn('Error closing audio context:', error);
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
    
    // Reset all flags
    shouldInterruptRef.current = false;
    isPlayingRef.current = false;
    isUserSpeakingRef.current = false;
    
    console.log('✅ Enhanced cleanup completed');
  };

  const acceptCall = async () => {
    try {
      setCallState(CALL_STATES.CONNECTING);
      
      // Get microphone access with high quality settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      // Start enhanced speech detection
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

      // Enhanced message handling
      socket.onmessage = async (event) => {
        try {
          // Handle binary data (audio/media) - preserve original quality
          if (event.data instanceof Blob) {
            addToQueue(event.data, 'audio');
            return;
          }

          // Handle ArrayBuffer - preserve original quality
          if (event.data instanceof ArrayBuffer) {
            const audioBlob = new Blob([event.data], { type: 'audio/webm;codecs=opus' });
            addToQueue(audioBlob, 'audio');
              return;
            }
            
          // Handle JSON messages
          const data = JSON.parse(event.data);

          // Handle interruption with immediate execution
          if (data.interrupt || data.type === "interruption") {
            console.log('🚨 Server interruption received - executing immediate interruption');
            executeImmediateInterruption();
            return;
          }

          // Handle background music
          if (data.type === "background_music" && data.path) {
            console.log(`🎵 Received background music: ${data.path}`);
            startBackgroundMusic(data.path);
            return;
          }

          // Handle media metadata with quality preservation
          if (data.media_meta) {
            const { type, id, tag, mediatype } = data.media_meta;
            
            if (data.data_b64) {
              // Preserve original MIME type for quality
              const mediaBlob = base64ToBlob(data.data_b64, mediatype || 'audio/webm;codecs=opus');
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

          // Handle audio chunks with quality preservation
          if (data.audio) {
            setIsLoading(true);
            // Use proper MIME type for Hume audio
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

      // Set up media recorder with high quality
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000 // Higher bitrate for better quality
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

      mediaRecorder.start(100); // Smaller chunks for better real-time performance
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
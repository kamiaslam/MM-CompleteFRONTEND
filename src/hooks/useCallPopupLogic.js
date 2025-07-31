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
  const [backgroundVolume, setBackgroundVolume] = useState(0.03); // User-controlled volume
  
  // WebSocket and Media Stream
  const socketRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  // Enhanced Audio Management with real-time interruption
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const urlsToCleanupRef = useRef(new Set());
  const shouldInterruptRef = useRef(false); // New: interruption flag
  
  // Real-time audio streaming for small chunks
  const audioStreamQueue = useRef([]); // Queue for immediate playback
  const isStreamingRef = useRef(false); // Track if we're currently streaming
  const nextPlayTimeRef = useRef(0); // Precise timing for seamless transitions
  
  // High-quality audio context management
  const audioContextRef = useRef(null);
  const currentAudioSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Background Music Management
  const backgroundMusicRef = useRef(null);
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
  const speechFramesRef = useRef(0); // Track consecutive speech frames
  const silenceFramesRef = useRef(0); // Track consecutive silence frames

  useEffect(() => {
    setCallState(CALL_STATES.INCOMING);
    return () => cleanup();
  }, []);

  // Initialize high-quality audio context with proper sample rate
  const initializeAudioContext = async () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 48000, // Match Hume's 48kHz output
        latencyHint: 'interactive'
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
    
    // Clear stream queue and reset timing
    audioStreamQueue.current = [];
    nextPlayTimeRef.current = 0;
    
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

  // Enhanced queue processing with proper MIME type handling
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

    console.log(`▶️ Playing: ${item.type}, format: ${item.mimeType}`);
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
      
      // Use the stored MIME type from the queue item
      const properBlob = new Blob([audioBlob], { 
        type: item.mimeType || 'audio/wav' 
      });
      
      const success = await playAudioWithEnhancedQuality(properBlob);
      if (success) {
        return;
      }
    } catch (error) {
      console.warn('Enhanced audio failed:', error);
      isPlayingRef.current = false;
      shouldInterruptRef.current = false;
      setTimeout(playNext, 50);
    }
  };

  // Enhanced queue addition with proper MIME type tracking
  const addToQueue = (audioBlob, type = 'audio', mimeType = 'audio/wav') => {
    // Skip if interrupted
    if (shouldInterruptRef.current) {
      console.log('🚫 Skipping queue addition due to interruption');
      return;
    }
    
    console.log(`🎵 Adding to queue: type=${type}, size=${audioBlob.size} bytes, mime=${mimeType}`);
    
    // Create URL with proper cleanup tracking
    const url = URL.createObjectURL(audioBlob);
    urlsToCleanupRef.current.add(url);
    
    // Store MIME type with the queue item
    audioQueueRef.current.push({ url, type, blob: audioBlob, mimeType });
    
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
    backgroundMusicRef.current.volume = backgroundVolume; // Use user-controlled volume
    backgroundMusicRef.current.loop = true;
    
    // Set audio quality properties
    backgroundMusicRef.current.preload = 'auto';
    backgroundMusicRef.current.crossOrigin = 'anonymous';

    backgroundMusicRef.current.play().catch(error => {
      console.error('❌ Failed to start background music:', error);
    });
  };

  // Function to update background music volume
  const updateBackgroundVolume = (newVolume) => {
    setBackgroundVolume(newVolume);
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = newVolume;
      console.log(`🎵 Background music volume updated to: ${newVolume}`);
    }
    // Show toast notification for user feedback
    toast.success(`Background volume set to ${Math.round(newVolume * 100)}%`, {
      duration: 1000,
      position: 'top-right',
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
        if (rms > 20 && !isUserSpeakingRef.current) { // Increased threshold from 15 to 35
          speechFramesRef.current++;
          silenceFramesRef.current = 0;
          
          // Require 5 consecutive speech frames to confirm speaking
          if (speechFramesRef.current >= 5) {
            isUserSpeakingRef.current = true;
            console.log('🎤 User started speaking - IMMEDIATE interruption');
            executeImmediateInterruption();
            stopBackgroundMusic();
          }
        } else if (rms < 10 && isUserSpeakingRef.current) { // Increased threshold from 8 to 20
          silenceFramesRef.current++;
          speechFramesRef.current = 0;
          
          // Require 8 consecutive silence frames to confirm stopped speaking
          if (silenceFramesRef.current >= 8) {
            isUserSpeakingRef.current = false;
            console.log('🤫 User stopped speaking');
            // Reset interruption flag after a short delay
            setTimeout(() => {
              shouldInterruptRef.current = false;
            }, 500);
          }
        } else {
          // Reset counters if neither clear speech nor silence
          speechFramesRef.current = 0;
          silenceFramesRef.current = 0;
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

  // Simplified base64 conversion for WAV audio
  const base64ToBlob = (base64, mime = 'audio/wav') => {
    try {
      const base64Data = base64.replace(/^data:audio\/[^;]+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create blob with the provided MIME type (WAV from Hume)
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

  // Real-time audio streaming for immediate playback
  const streamAudioChunk = async (audioBlob, mimeType = 'audio/wav') => {
    try {
      // Skip if interrupted
      if (shouldInterruptRef.current) {
        console.log('🚫 Skipping audio chunk due to interruption');
        return;
      }

      await initializeAudioContext();
      
      // Decode the audio immediately
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      console.log(`🎵 Real-time chunk: duration=${audioBuffer.duration.toFixed(3)}s, size=${audioBlob.size} bytes`);
      
      // Check for interruption after decoding
      if (shouldInterruptRef.current) {
        console.log('🚫 Interruption detected after decoding, aborting playback');
        return;
      }
      
      // Initialize next play time if this is the first chunk
      if (nextPlayTimeRef.current === 0) {
        nextPlayTimeRef.current = audioContextRef.current.currentTime + 0.05; // 50ms buffer
        console.log(`⏰ Started real-time stream at ${nextPlayTimeRef.current.toFixed(3)}s`);
      }
      
      // Create buffer source
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNodeRef.current);
      
      // Schedule for immediate playback
      source.start(nextPlayTimeRef.current);
      console.log(`▶️ Scheduled chunk at ${nextPlayTimeRef.current.toFixed(3)}s (duration: ${audioBuffer.duration.toFixed(3)}s)`);
      
      // Update next play time for seamless transition
      nextPlayTimeRef.current += audioBuffer.duration;
      
      // Handle end event
      source.onended = () => {
        console.log('🔚 Chunk ended');
        // Continue with next chunk if available
        if (audioStreamQueue.current.length > 0 && !shouldInterruptRef.current) {
          const nextChunk = audioStreamQueue.current.shift();
          streamAudioChunk(nextChunk.blob, nextChunk.mimeType);
        } else if (audioStreamQueue.current.length === 0) {
          // Reset timing when stream ends
          nextPlayTimeRef.current = 0;
          console.log('⏰ Stream ended - reset timing');
        }
      };
      
      currentAudioSourceRef.current = source;
      
    } catch (error) {
      console.error('❌ Real-time audio streaming failed:', error);
    }
  };

  const cleanup = () => {
    console.log('🧹 Starting enhanced cleanup');
    
    // Clear all audio queues and reset timing
    audioQueueRef.current = [];
    audioStreamQueue.current = [];
    nextPlayTimeRef.current = 0;
    isPlayingRef.current = false;
    isStreamingRef.current = false;
    
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

          // Handle audio chunks with real-time streaming
          if (data.audio) {
            setIsLoading(true);
            
            // Use the audio_format from the server, or default to WAV
            const audioFormat = data.audio_format || 'audio/wav';
            console.log('📡 Received Audio Data:', {
              dataLength: data.audio.length,
              audioFormat: audioFormat,
              chunksCombined: data.chunks_combined,
              totalSize: data.total_size,
              segmentType: data.segment_type,
              hasAudio: !!data.audio
            });
            
            const audioBlob = base64ToBlob(data.audio, audioFormat);
            if (audioBlob) {
              // For real-time streaming, play immediately or queue for seamless transition
              if (nextPlayTimeRef.current === 0) {
                // First chunk - start streaming immediately
                streamAudioChunk(audioBlob, audioFormat);
              } else {
                // Subsequent chunks - add to stream queue for seamless playback
                audioStreamQueue.current.push({ blob: audioBlob, mimeType: audioFormat });
                console.log(`📦 Queued chunk for streaming, queue size: ${audioStreamQueue.current.length}`);
              }
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
    backgroundVolume, // Add backgroundVolume to the return object
    updateBackgroundVolume, // Add updateBackgroundVolume to the return object
  };
};

export default useCallPopupLogic;
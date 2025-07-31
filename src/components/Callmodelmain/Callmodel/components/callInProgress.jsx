import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Typography, IconButton, Grid, Card, CardMedia, CardContent, Slider 
} from '@mui/material';
import { Mic, MicOff, Close, CallEnd, VolumeUp } from '@mui/icons-material';
import VoiceReactiveSpeaker from './neonVisulizer';
import { fetchTemporaryMediaLinks } from '@/api/axiosApis/get';

const CallInProgress = ({
  onEndCall,
  callPreData,
  audioRef,
  mediaStream,
  isMicOn,
  toggleMic,
  callId,
  backgroundVolume,
  updateBackgroundVolume
}) => {
  const [mediaLinks, setMediaLinks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(callPreData?.time || 300);
  const intervalRef = useRef(null);
//   const callId = "0bea0b25-aefa-4c04-b426-b353605544d6";

  // Listen for call-image-frame events (from WebSocket binary image)
  useEffect(() => {
    const handler = (e) => {
      setSelectedImage(e.detail.imageUrl);
    };
    window.addEventListener('call-image-frame', handler);
    return () => window.removeEventListener('call-image-frame', handler);
  }, []);

  // Fetch media links
  useEffect(() => {
    if (!callId) return;
    fetchTemporaryMediaLinks(callId)
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setMediaLinks(res.data.slice(0, 2)); // max two
        }
      })
      .catch(console.error);
  }, [callId]);

  // Countdown logic
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onEndCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timeLeft, onEndCall]);

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      position="relative"
    >
      {/* Timer */}
        <Box width="100%" display="flex" justifyContent="center" mt={1} sx={{ position: 'absolute', zIndex: 1500 }}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={1}
                bgcolor="secondary.main"
                sx={{
                borderRadius: '50px',
                boxShadow: 1,
                px: 3,
                }}
            >
                <Typography
                variant="subtitle2"
                sx={{
                    color: timeLeft <= 50 ? 'red' : 'black',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                }}
                >
                Time Left: {timeLeft}s
                </Typography>
            </Box>
        </Box>


        {/* Main Visualizer + Buttons */}
        <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        >
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ gap: 4 }}>
            {/* Mic Button */}
            <Box display="flex" flexDirection="column" alignItems="center" sx={{
                position: 'relative',
                zIndex: 10,
                transform: 'translateX(180px)', // push right away from visualizer
                }}
            >
            <IconButton
                onClick={toggleMic}
                size="large"
                sx={{
                bgcolor: isMicOn ? 'primary.main' : 'grey.500',
                color: 'white',
                boxShadow: 3,
                '&:hover': {
                    bgcolor: isMicOn ? 'primary.dark' : 'grey.600',
                },
                }}
            >
                {isMicOn ? <Mic /> : <MicOff />}
            </IconButton>
            <Typography mt={1} variant="caption" color={isMicOn ? 'primary.main' : 'text.secondary'}>
                {isMicOn ? 'Live' : 'Muted'}
            </Typography>
            
            {/* Volume Control */}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VolumeUp sx={{ 
                  fontSize: 16, 
                  color: backgroundVolume > 0.5 ? 'primary.main' : 'text.secondary', 
                  mr: 1,
                  transition: 'color 0.2s ease'
                }} />
                <Typography variant="caption" color="text.secondary">
                  Background Volume
                </Typography>
              </Box>
              <Slider
                value={backgroundVolume}
                onChange={(event, newValue) => updateBackgroundVolume(newValue)}
                min={0}
                max={1}
                step={0.01}
                sx={{
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                    backgroundColor: 'primary.main',
                    transition: 'transform 0.1s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'grey.300',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {Math.round(backgroundVolume * 100)}%
              </Typography>
            </Box>
            </Box>

            {/* VoiceReactiveSpeaker */}
            <Box
            flexGrow={1.5}
            sx={{
                minWidth: 800,
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
            <VoiceReactiveSpeaker stream={mediaStream} />
            </Box>

            {/* End Call Button */}
            <Box display="flex" flexDirection="column" alignItems="center" sx={{
                position: 'relative',
                zIndex: 10,
                transform: 'translateX(-180px)', // push right away from visualizer
                }}
            >
            <IconButton
                onClick={onEndCall}
                size="large"
                sx={{
                bgcolor: 'error.main',
                color: 'white',
                boxShadow: 3,
                '&:hover': { bgcolor: 'error.dark' },
                }}
            >
                <CallEnd />
            </IconButton>
            <Typography variant="caption" mt={1} color="error.main">
                End Call
            </Typography>
            
            {/* Volume Control (Right Side) */}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VolumeUp sx={{ 
                  fontSize: 16, 
                  color: backgroundVolume > 0.5 ? 'error.main' : 'text.secondary', 
                  mr: 1,
                  transition: 'color 0.2s ease'
                }} />
                <Typography variant="caption" color="text.secondary">
                  Voice Volume
                </Typography>
              </Box>
              <Slider
                value={backgroundVolume}
                onChange={(event, newValue) => updateBackgroundVolume(newValue)}
                min={0}
                max={1}
                step={0.01}
                sx={{
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                    backgroundColor: 'error.main',
                    transition: 'transform 0.1s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'error.main',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'grey.300',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {Math.round(backgroundVolume * 100)}%
              </Typography>
            </Box>
            </Box>
        </Box>
        </Box>
      <Box px={2} pb={2} sx={{
                position: 'relative',
                zIndex: 10,
                transform: 'translateY(-40px)', // push right away from visualizer
                }}
        >
        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 1, color: 'text.primary' }}
        >
          Call in progress
        </Typography>
      </Box>

      {/* “Call In Progress” + Thumbnails */}
      <Box px={2} pb={2} sx={{
                position: 'relative',
                zIndex: 10,
                transform: 'translateY(-40px)', // push right away from visualizer
                }}
        >

        <Grid container spacing={2} justifyContent="center">
          {mediaLinks.length === 0 && (
            <Typography color="text.secondary"></Typography>
          )}
          {mediaLinks.map((url, i) => (
            <Grid item key={i}>
              <Card
                sx={{
                  width: 140,
                  height: 140,
                  cursor: 'pointer',
                  boxShadow: 3,
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.2s',
                }}
                onClick={() => setSelectedImage(url)}
              >
                <CardMedia
                  component="img"
                  image={url}
                  alt={`media-${i}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Overlay for selected image */}
      {selectedImage && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          bgcolor="rgba(0,0,0,0.93)"
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          pt={5}
          zIndex={2000}
        >
          <Card sx={{ maxWidth: 500, width: '90%', position: 'relative', boxShadow: 8 , paddingTop:2, paddingBottom:2}} >
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.450', zIndex: 1 }}
            >
              <Close />
            </IconButton>
            <CardMedia
              component="img"
              image={selectedImage}
              alt="Zoomed"
              sx={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default CallInProgress;

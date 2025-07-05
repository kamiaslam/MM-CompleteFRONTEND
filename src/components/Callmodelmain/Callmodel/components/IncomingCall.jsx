import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { keyframes } from '@emotion/react';

const ringAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(2.5); opacity: 0.99; }
  100% { transform: scale(1); opacity: 1; }
`;

const buttonSeeSawAnimation = keyframes`
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(8deg); }
  60% { transform: rotate(-5deg); }
  80% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

const IncomingCall = ({ onAccept, onDecline }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/assets/tunes/Ringtune.mp3');
    audio.loop = true;
    audioRef.current = audio;

    // Play audio
    audio.play().catch(err => {
      console.warn('Audio play failed:', err);
    });

    // Cleanup audio on unmount
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleAccept = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onAccept?.();
  };

  const handleDecline = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onDecline?.();
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PhoneInTalkIcon
        color="primary"
        sx={{ fontSize: 80, mt: 10, mb: 20, animation: `${ringAnimation} 2s infinite` }}
      />

      <Typography variant="h6" color="text.secondary" gutterBottom>
        Incoming Call...
      </Typography>

      <Box mt={4} display="flex" justifyContent="center" gap={4}>
        <Button
          variant="contained"
          color="success"
          onClick={handleAccept}
          size="large"
          startIcon={
            <PhoneIcon sx={{ animation: `${buttonSeeSawAnimation} 2s infinite` }} />
          }
        >
          Accept
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDecline}
          size="large"
          startIcon={
            <CallEndIcon sx={{ animation: `${buttonSeeSawAnimation} 2s infinite` }} />
          }
        >
          Decline
        </Button>
      </Box>
    </Box>
  );
};

export default IncomingCall;

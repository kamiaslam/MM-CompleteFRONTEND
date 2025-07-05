// components/ConnectingScreen.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const ConnectingScreen = () => {
  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <CircularProgress size={60} thickness={5} />
      <Typography variant="h6" mt={4}>
        Connecting to the call...
      </Typography>
    </Box>
  );
};

export default ConnectingScreen;

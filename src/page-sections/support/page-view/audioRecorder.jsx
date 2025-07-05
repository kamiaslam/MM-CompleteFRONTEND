import React, { useState, useRef } from "react"; // Add useRef import
import { ReactMic } from "react-mic";
import { Box, IconButton, Tooltip } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import PropTypes from "prop-types";

const AudioRecorder = ({ setMedia }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
    const [timer, setTimer] = useState(0);
  const timerInterval = useRef(null);

  // Start recording
  const startRecording = () => {
    setRecording(true);
    setAudioURL("");
    setTimer(0);
    timerInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  // Stop recording
  const stopRecording = () => {
      setRecording(false); // This will trigger onStop callback from ReactMic
      clearInterval(timerInterval.current); // Clear the interval
    timerInterval.current = null; // Reset the ref
    setTimer(0);
  };

  // On stop, handle the recorded blob
  const onStop = (recordedBlob) => {
    setAudioURL(URL.createObjectURL(recordedBlob.blob));
    setMedia(recordedBlob.blob);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        marginBottom: "20px",
      }}
    >
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={onStop}
        strokeColor="#2196f3"
        backgroundColor="transparent"
        mimeType="audio/wav"
        width={300}
        height={100}
        visualSetting="frequencyBars"
      />
      {recording && (
        <Box sx={{ mt: 1, color: "text.secondary" }}>Recording: {timer}s</Box>
      )}

      <Tooltip
        title={recording ? "Stop Recording" : "Start Recording"}
        placement="top"
      >
        <IconButton
          sx={{
            width: "56px",
            height: "56px",
            marginTop: "16px",
            backgroundColor: recording ? "#ef5350" : "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: recording ? "#d32f2f" : "primary.main",
            },
            transition: "all 0.3s ease",
          }}
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? (
            <StopIcon fontSize="large" />
          ) : (
            <MicIcon fontSize="large" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

AudioRecorder.propTypes = {
  setMedia: PropTypes.func.isRequired,
};

export default AudioRecorder;

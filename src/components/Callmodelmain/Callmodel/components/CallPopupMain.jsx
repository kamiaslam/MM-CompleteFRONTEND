import React, { useRef } from "react";
import { alpha, Box, Card, useTheme } from "@mui/material";
import useSettings from "@/hooks/useSettings";
import useCallPopupLogic, { CALL_STATES } from "@/hooks/useCallPopupLogic";
import IncomingCall from "./IncomingCall";
import CallInProgress from "./callInProgress";
import ConnectingScreen from "./ConnectingScreen"; // ⬅️ NEW loading screen

const CallPopupMain = ({ Patient_id, callPreData, callId, onClose }) => {
  const { settings } = useSettings();
  const theme = useTheme();
  const audioRef = useRef(null);
  const {
    callState,
    acceptCall,
    declineCall,
    endCall,
    mediaStream,
    isMicOn,
    toggleMic
  } = useCallPopupLogic({ Patient_id, callPreData, callId, onClose, audioRef });

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 9999999999999999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          padding: 3,
          boxShadow: 3,
          backgroundColor: alpha(theme.palette.background.default, 0.95),
          border: '2px solid black',
        }}
      >
        {callState === CALL_STATES.INCOMING && (
          <IncomingCall
            patientId={Patient_id}
            onAccept={acceptCall}
            onDecline={declineCall}
          />
        )}

        {callState === CALL_STATES.CONNECTING && (
          <ConnectingScreen />
        )}

        {callState === CALL_STATES.ACTIVE && (
          <CallInProgress
            onEndCall={endCall}
            callPreData={callPreData}
            audioRef={audioRef}
            mediaStream={mediaStream}
            isMicOn={isMicOn}           // 👈 pass down
            toggleMic={toggleMic}
            callId={callId}
          />
        )}
                  {/* <CallInProgress
            onEndCall={endCall}
            callPreData={callPreData}
            audioRef={audioRef}
            mediaStream={mediaStream}
            isMicOn={isMicOn}           // 👈 pass down
            toggleMic={toggleMic}
            callId={callId}
          /> */}
      </Card>
    </Box>
  );
};

export default CallPopupMain;

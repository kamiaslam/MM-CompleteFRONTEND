import "regenerator-runtime/runtime";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useWebSocketContext } from "@/api/WebSocketProvider";
import RTL from "@/components/rtl";
import { routes } from "./routes";
import "./global.css";
import "./i18n";
import { Toaster, useToasterStore } from "react-hot-toast";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Callmodelmain from "./components/Callmodelmain";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ProvidersWrapper from "./contexts/ProvidersWrapper";
import { getCallPreDataV2 } from "@/api/call"; 
import { useMockNotification } from "@/__fakeData__/useMockNotification";
export default function App() {
  const { notificationMessages } = useWebSocketContext();
  // const{ notificationMessages } = useMockNotification();
  const TOAST_LIMIT = 1;
  // State to track the call_id
  const [callId, setCallId] = useState(null);
  // Add new state to store call pre data
  const [callPreData, setCallPreData] = useState(null);
  const [showMicPermissionPopup, setShowMicPermissionPopup] = useState(false);
  const [micPermission, setMicPermission] = useState(() => {
    return localStorage.getItem("micPermissionStatus") || null;
  });
  const [errorMessage, setErrorMessage] = useState("");
  const session = JSON.parse(localStorage.getItem("authUser"));
  const Patient_id= session?.user_info?.id;
  const isPatient = session?.role === "patient";
  const handleCloseCallPopup = () => {
    localStorage.removeItem("scheduled_call_id"); 
    setCallPreData(null)
    setCallId(null); // Close the Callmodelmain component by setting callId to null
  };
  

  const requestMicPermission = async () => {
    try {
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      localStorage.setItem("micPermissionStatus", "granted");
      // stream.getTracks().forEach((track) => track.stop());
      setShowMicPermissionPopup(false);
      toast.success("Microphone access granted successfully!");
    } catch (error) {
      setMicPermission("denied");
      localStorage.setItem("micPermissionStatus", "denied");
      setErrorMessage(error.message);
      setShowMicPermissionPopup(false);
      toast.error("Microphone access denied. Voice calls may not work properly.");
    }
  };

  useEffect(() => {
    if (micPermission === null && session && isPatient) {
      navigator.permissions
        .query({ name: "microphone" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            setMicPermission("granted");
            localStorage.setItem("micPermissionStatus", "granted");
          } else if (permissionStatus.state === "denied") {
            setMicPermission("denied");
            localStorage.setItem("micPermissionStatus", "denied");
          } else {
            setShowMicPermissionPopup(true);
          }
        })
        .catch(() => {
          setShowMicPermissionPopup(true);
        });
    }
  }, [micPermission, session, isPatient]);

  function ToastLimitEffect() {
    const { toasts } = useToasterStore();

    useEffect(() => {
      toasts
        ?.filter((t) => t.visible)
        ?.filter((_, i) => i >= TOAST_LIMIT)
        ?.forEach((t) => toast?.dismiss(t.id));
    }, [toasts]);

    return null;
  }

  

  useEffect(() => {
    if (
      notificationMessages?.[notificationMessages?.length - 1]?.message === "Receive call" &&
      notificationMessages?.[notificationMessages?.length - 1]?.scheduled_id
    ) {
      const scheduledCallId = notificationMessages?.[notificationMessages?.length - 1]?.scheduled_id;
      console.log("message recieved")
      console.log('schadule id is : ',scheduledCallId)
      const fetchAndHandleCall = async () => {
        try {
          const response = await getCallPreDataV2(scheduledCallId, Patient_id);
          setCallPreData(response);
          setCallId(scheduledCallId); // Set callId ONLY after data is fetched
          localStorage.setItem("scheduled_call_id", JSON.stringify(scheduledCallId));
        } catch (error) {
          console.error("Error fetching call data:", error);
          toast.error("Failed to fetch call information.");
        }
      };

      fetchAndHandleCall();
    }
  }, [notificationMessages]);

  const router = createBrowserRouter(routes());

  const handleDeny = () => {
    setShowMicPermissionPopup(false);
    setMicPermission("denied");
    localStorage.setItem("micPermissionStatus", "denied");
    toast.error("Microphone access denied. Voice calls may not work properly.");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ProvidersWrapper>
        <RTL>
          <ToastLimitEffect />
          <Toaster
            containerStyle={{ zIndex: "99999999999999" }}
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                fontSize: "13px",
                color: "#232743",
                backgroundColor: "#fff",
              },
            }}
          />
          {/* Microphone Permission Dialog */}
          <Dialog
            open={showMicPermissionPopup}
            onClose={handleDeny}
            aria-labelledby="mic-permission-dialog-title"
            aria-describedby="mic-permission-dialog-description"
          >
            <DialogTitle id="mic-permission-dialog-title">Microphone Permission Required</DialogTitle>
            <DialogContent>
              <DialogContentText id="mic-permission-dialog-description">
                This application needs access to your microphone for voice calls. Would you like to allow microphone access?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeny} color="error">
                Deny
              </Button>
              <Button onClick={requestMicPermission} color="primary" variant="contained">
                Allow
              </Button>
            </DialogActions>
          </Dialog>
          {/* Only render Callmodelmain when callId is available */}
          {callId && (
            <Callmodelmain {...{ Patient_id, callPreData , callId , onClose: handleCloseCallPopup }} />
          )}
          <CssBaseline />
          <RouterProvider router={router} />
        </RTL>
      </ProvidersWrapper>
    </LocalizationProvider>
  );
}

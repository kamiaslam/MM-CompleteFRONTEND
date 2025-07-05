import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import { checkToken, getSession } from "../helper/authHelper";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const notificationSocketRef = useRef(null);
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [token, setToken] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  const isSocketOpen = (socketRef) => {
    return socketRef.current && socketRef.current.readyState === WebSocket.OPEN;
  };

  const initializeWebSocket = async (newToken) => {
    if (newToken) {
      const res = await checkToken();
      setIsConnecting(true);

      if (notificationSocketRef.current) {
        notificationSocketRef.current.close();
      }

      try {
        notificationSocketRef.current = new WebSocket(`${import.meta.env.VITE_SOCKET_API_URL}/ws/notifications?token=${newToken}`);
        

        notificationSocketRef.current.onopen = () => {
          setIsConnecting(false);
          // Clear any existing reconnection timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        notificationSocketRef.current.onmessage = (event) => {
          try {
            const newMessage = JSON.parse(event.data);
            
            setNotificationMessages((prevMessages) => [...prevMessages, newMessage]);
          } catch (error) {
            console.error("Error parsing notification message", error);
          }
        };

        notificationSocketRef.current.onclose = () => {
          setIsConnecting(false);
          // Attempt to reconnect immediately
          reconnectTimeoutRef.current = setTimeout(() => {
            const session = getSession();
            if (session?.access_token) {
              initializeWebSocket(session.access_token);
            }
          }, 100); // Reduced reconnect time to 1 second
        };

        notificationSocketRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnecting(false);
        };
      } catch (error) {
        console.error("Error initializing WebSocket:", error);
        setIsConnecting(false);
      }
    }
  };

  const sendReadAllEvent = () => {
    if (isSocketOpen(notificationSocketRef)) {
      const message = JSON.stringify({ event: "read_all" });
      notificationSocketRef.current.send(message);
    } else {
      console.error("WebSocket is not open. Cannot send 'read_all' event.");
    }
  };

  const disconnectWebSocket = () => {
    if (notificationSocketRef.current) {
      notificationSocketRef.current.close();
      notificationSocketRef.current = null;
    }
    setNotificationMessages([]);
    setToken(null);
  };

  useEffect(() => {
    const session = getSession();
    if (session?.access_token) {
      setToken(session.access_token);
      initializeWebSocket(session.access_token);
    }

    // Add event listener for online/offline status
    const handleOnline = () => {
      const session = getSession();
      if (session?.access_token) {
        initializeWebSocket(session.access_token);
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (notificationSocketRef.current) {
        notificationSocketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        notificationSocketRef,
        notificationMessages,
        sendReadAllEvent,
        initializeWebSocket,
        disconnectWebSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// Export the hook to use WebSocket context
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};

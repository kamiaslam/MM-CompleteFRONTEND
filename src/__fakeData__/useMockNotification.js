import { useEffect, useState } from "react";

export function useMockNotification() {
  const [notificationMessages, setNotificationMessages] = useState([]);

  useEffect(() => {
    // Simulate a "Receive call" notification after 5 seconds
    const timer = setTimeout(() => {
      setNotificationMessages([
        {
          message: "Receive call",
          scheduled_id: "0bea0b25-aefa-4c04-b426-b353605544d6",
        },
      ]);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return { notificationMessages };
}

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";

// MUI Icons
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import CakeIcon from "@mui/icons-material/Cake";
import HistoryIcon from "@mui/icons-material/History";
import ImageIcon from "@mui/icons-material/Image";
import CallIcon from "@mui/icons-material/Call";
import DescriptionIcon from "@mui/icons-material/Description";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";

// CUSTOM COMPONENTS
import Link from "@/components/link";
import Scrollbar from "@/components/scrollbar";
import { H6, Paragraph, Small } from "@/components/typography";
import { FlexBox } from "@/components/flexbox";


// Other imports
import { NavLink, useNavigate } from "react-router-dom";
import moment from "moment";
import { useWebSocketContext } from "../../../api/WebSocketProvider";
import useAuth from "@/hooks/useAuth";

const getNotificationIconComponent = (type) => {
  switch (type) {
    case "birthday":
      return <CakeIcon sx={{ width: 25, height: 25 }} />;
    case "life_history":
      return <HistoryIcon sx={{ width: 25, height: 25 }} />;
    case "media":
      return <ImageIcon sx={{ width: 25, height: 25 }} />;
    case "call_summary":
      return <CallIcon sx={{ width: 25, height: 25 }} />;
    case "instruction":
      return <AssignmentIcon sx={{ width: 25, height: 25 }} />;
    case "description":
      return <DescriptionIcon sx={{ width: 25, height: 25 }} />;
    default:
      return <NotificationsIcon sx={{ width: 25, height: 25 }} />;
  }
};

export const getNotificationTitle = (type) => {
  switch (type) {
    case "birthday":
      return "Birthday Reminder";
    case "life_history":
      return "Life History";
    case "media":
      return "Media";
    case "call_summary":
      return "Call Summary";
    case "instruction":
      return "Instruction";
    case "description":
      return "Description";
    default:
      return "Notification";
  }
};

export function ListItem({ msg, onClick }) {
  const isRead = msg.isRead;

  return (
    <div onClick={onClick}>
      <FlexBox
        p={2}
        gap={2}
        alignItems="center"
        sx={{
          borderBottom: 1,
          cursor: "pointer",
          borderColor: "divider",
          backgroundColor: isRead ? "transparent" : "action.hover",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <FlexBox alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              marginRight: 2,
              borderRadius: "50%",
              backgroundColor: isRead ? "grey.400" : "primary.main",
            }}
          />
          {getNotificationIconComponent(msg.type)}
        </FlexBox>

        <div>
          <Paragraph fontWeight={500}>
            {getNotificationTitle(msg.type)}
          </Paragraph>
          <Small ellipsis color="text.secondary">
            {msg.message}
          </Small>
          <br />
          <Small style={{ color: "grey" }}>
            {moment.utc(msg.createdAt).format("MMM DD, YYYY")}
          </Small>
        </div>
      </FlexBox>
    </div>
  );
}

export default function Notifications() {
  const { notificationMessages } = useWebSocketContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const notificationData = notificationMessages[
    notificationMessages.length - 1
  ] || { notifications: [] };

  const displayNotifications =
    user?.role === "care_home"
      ? notificationData?.notifications || []
      : (notificationData?.notifications || []).filter(
          (notification) => notification.is_read
        );

  return (
    <Card>
      <Box padding={3}>
        <H6 fontSize={14}>
          {user?.role === "care_home"
            ? "All Notifications"
            : "Read Notifications"}
        </H6>
      </Box>
      <Box padding={3}>
        {displayNotifications.length === 0 ? (
          <Paragraph fontWeight="500" textAlign="center" p={2}>
            There are no notifications
          </Paragraph>
        ) : (
          displayNotifications.map((notification) => (
            <ListItem
              key={notification.id}
              msg={{
                id: notification.id,
                message: notification.message,
                createdAt: notification.created_at,
                type: notification.type,
                isRead: notification.is_read,
              }}
              onClick={() => {
                navigate(
                  `/dashboard/account?tab=Notifications&id=${notification.id}`
                );
              }}
            />
          ))
        )}
      </Box>
    </Card>
  );
}

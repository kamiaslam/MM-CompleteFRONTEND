import { Fragment, useRef, useState } from "react";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";

import PopoverLayout from "./PopoverLayout";
import { Paragraph, Small } from "@/components/typography";
import { useWebSocketContext } from "../../../api/WebSocketProvider";
import NotificationsIcon from "@/icons/NotificationsIcon";
import { ListItem } from "../../../page-sections/accounts/notifications/Notifications";
import { getSession } from "../../../helper/authHelper";
import { useNavigate } from "react-router-dom";


const StyledTab = styled(Tab)({
  flex: 1,
  marginLeft: 0,
  marginRight: 0,
});

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState("1");
  const userInfo = getSession();
  const userRole = userInfo?.role;
  const navigate = useNavigate();
  const { notificationMessages, sendReadAllEvent } = useWebSocketContext();

  const notificationData = notificationMessages[
    notificationMessages.length - 1
  ] || { notifications: [], count: 0 };
  const allNotifications = notificationData?.notifications || [];

  const unreadNotifications = allNotifications.filter(
    (notification) => !notification.is_read
  );
  const readNotifications = allNotifications.filter(
    (notification) => notification.is_read
  );

  const handleTabChange = (_, value) => setTabValue(value);

  const sendReadEvent = async (notificationId) => {
    if (notificationId && userRole === "care_home") {
      try {
        // await getNotifications(notificationId);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };
  const handleNotificationClick = async (notificationId) => {
    if (userRole === "care_home") {
      await sendReadEvent(notificationId);
      navigate(`/dashboard/account?tab=Notifications&id=${notificationId}`);
    }
  };

  const handleOpenMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  };

  const handleCloseMenu = () => {
    if (userRole === "family_member" && unreadNotifications?.length) {
      sendReadAllEvent();
    }
    setOpen(false);
    setTabValue("1");
  };

  return (
    <Fragment>
      <IconButton ref={anchorRef} onClick={handleOpenMenu}>
        <Badge color="error" badgeContent={unreadNotifications.length}>
          <NotificationsIcon sx={{ color: "grey.400" }} />
        </Badge>
      </IconButton>

      <PopoverLayout
        title="Notifications"
        popoverOpen={open}
        anchorRef={anchorRef}
        popoverClose={handleCloseMenu}
        ViewButton={
          tabValue == 1
            ? unreadNotifications?.length
            : readNotifications?.length
        }
      >
        <TabContext value={tabValue}>
          <TabList onChange={handleTabChange}>
            <StyledTab
              value="1"
              label={`Messages (${unreadNotifications.length})`}
            />
            <StyledTab
              value="2"
              label={`Archived (${readNotifications.length})`}
            />
          </TabList>

          {allNotifications.length === 0 ? (
            <Paragraph fontWeight="500" textAlign="center" p={2}>
              You have no notifications at the moment.
            </Paragraph>
          ) : (
            <>
              <TabPanel value="1">
                {unreadNotifications.length === 0 ? (
                  <Paragraph fontWeight="500" textAlign="center" p={2}>
                    No new notifications
                  </Paragraph>
                ) : (
                  unreadNotifications.map((notification) => (
                    <ListItem
                      key={notification.id}
                      msg={{
                        id: notification.id,
                        message: notification.message,
                        createdAt: notification.created_at,
                        type: notification.type,
                        isRead: notification.is_read,
                      }}
                      onClick={() => handleNotificationClick(notification.id)}
                    />
                  ))
                )}
              </TabPanel>

              <TabPanel value="2">
                {readNotifications.length === 0 ? (
                  <Paragraph fontWeight="500" textAlign="center" p={2}>
                    No archived notifications
                  </Paragraph>
                ) : (
                  readNotifications.map((notification) => (
                    <ListItem
                      key={notification.id}
                      msg={{
                        id: notification.id,
                        message: notification.message,
                        createdAt: notification.created_at,
                        type: notification.type,
                        isRead: notification.is_read,
                      }}
                    />
                  ))
                )}
              </TabPanel>
            </>
          )}
        </TabContext>
      </PopoverLayout>
    </Fragment>
  );
}

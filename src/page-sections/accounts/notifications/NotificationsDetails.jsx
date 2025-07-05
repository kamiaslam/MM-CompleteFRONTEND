import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { H6, Paragraph, Small } from "@/components/typography";
import { FlexBox } from "@/components/flexbox";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { getNotifications } from "../../../api/axiosApis/get";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { authHeader } from "../../../helper/authHelper";
import { functionGetTime } from "../../../helper/constant";

export default function NotificationsDetails() {
  const [searchParams] = useSearchParams();
  const notificationId = searchParams.get("id");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getFileTypeFromUrl = (url) => {
    const extension = url.split(".").pop().toLowerCase();

    const audioExtensions = ["mp3", "wav", "ogg", "m4a"];
    const videoExtensions = ["mp4", "webm", "mov", "avi"];

    if (audioExtensions.includes(extension)) return "audio";
    if (videoExtensions.includes(extension)) return "video";
    return "image";
  };
  const URL = import.meta.env.VITE_NOTIFICATION_API_URL;
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        await axios
          .get(`${URL}/get-by-id/${notificationId}`, {
            headers: authHeader(),
          })
          .then((res) => {
            setNotification(res.data);
          });
      } catch (error) {
        console.error("Error fetching notification:", error);
      } finally {
        setLoading(false);
      }
    };

    if (notificationId) {
      fetchNotification();
    }
  }, [notificationId]);

  const handleBack = () => {
    navigate("/dashboard/account?tab=Notifications");
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  if (!notification) return <Box>No notification found</Box>;

  const renderContent = () => {
    // Get the type from the API response and ensure data exists
    const notificationType = notification?.data?.type;
    const notificationData = notification?.data;

    switch (notificationType) {
      case "life_history":
        return (
          <Box padding={3}>
            <div
              className="notification-details-layout-main"
              style={{ minHeight: "calc(100vh - 260px)" }}
            >
              <div className="notification-details-days-title">
                <H6 fontSize={14}>Life History Update</H6>
              </div>
              <FlexBox
                p={2}
                gap={2}
                my={2}
                alignItems="center"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: "transparent",
                }}
              >
                <FlexBox alignItems="center">
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                    }}
                  >
                    {notificationData?.description?.family_name?.charAt(0) ||
                      "U"}
                  </Avatar>
                </FlexBox>
                <div>
                  <Paragraph fontWeight={500}>
                    {notificationData?.description?.family_name || "Unknown"}
                  </Paragraph>
                  <Small ellipsis color="text.secondary">
                    {notificationData.message || "No message available"}
                  </Small>
                </div>
              </FlexBox>
              <div
                style={{ maxHeight: "calc(100vh - 400px)", overflow: "auto" }}
              >
                <Small ellipsis color="text.secondary">
                  {notificationData.description?.life_history ||
                    "No life history available"}
                </Small>
              </div>
            </div>
          </Box>
        );

      case "media":
        return (
          <Box padding={3}>
            <div
              className="notification-details-layout-main"
              style={{ minHeight: "calc(100vh - 260px)" }}
            >
              <div className="notification-details-days-title">
                <H6 fontSize={14}>Media Content</H6>
              </div>
              <FlexBox
                p={2}
                gap={2}
                my={2}
                alignItems="center"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: "transparent",
                }}
              >
                <FlexBox alignItems="center">
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                    }}
                  >
                    {notificationData?.description?.family_name?.charAt(0) ||
                      "U"}
                  </Avatar>
                </FlexBox>
                <div>
                  <Paragraph fontWeight={500}>
                    {notificationData?.description?.family_name || "Unknown"}
                  </Paragraph>
                  <Small ellipsis color="text.secondary">
                    {notificationData.message || "No message available"}
                  </Small>
                </div>
              </FlexBox>
              <FlexBox p={2} gap={2} my={2} flexDirection="column">
                {notificationData?.description?.file_urls && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    {notificationData?.description?.file_urls.map(
                      (file, index) => {
                        const fileType = file.type || getFileTypeFromUrl(file);

                        switch (fileType) {
                          case "audio":
                            return (
                              <Box
                                key={index}
                                component="audio"
                                controls
                                sx={{
                                  width: "100%",
                                  borderRadius: 1,
                                  border: 2,
                                  backgroundColor: "gray",
                                }}
                              >
                                <source
                                  src={file.url || file}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                              </Box>
                            );

                          case "video":
                            return (
                              <Box
                                key={index}
                                component="video"
                                controls
                                sx={{
                                  width: "100%",
                                  height: 200,
                                  objectFit: "cover",
                                  borderRadius: 1,
                                  border: 2,
                                }}
                              >
                                <source
                                  src={file.url || file}
                                  type="video/mp4"
                                />
                                Your browser does not support the video element.
                              </Box>
                            );

                          default: // Images
                            return (
                              <Box
                                key={index}
                                component="img"
                                src={file.url || file}
                                alt={`Media content ${index + 1}`}
                                sx={{
                                  width: "100%",
                                  height: 200,
                                  objectFit: "contain",
                                  borderRadius: 1,
                                  border: 2,
                                  backgroundColor: "gray",
                                }}
                              />
                            );
                        }
                      }
                    )}
                  </Box>
                )}
              </FlexBox>
            </div>
          </Box>
        );

      case "call_summary":
        return (
          <Box padding={3}>
            <div
              className="notification-details-layout-main"
              style={{ minHeight: "calc(100vh - 260px)" }}
            >
              <div className="notification-details-days-title">
                <H6 fontSize={14}>Call Summary</H6>
              </div>
              <FlexBox
                p={2}
                gap={2}
                my={2}
                alignItems="center"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: "transparent",
                }}
              >
                <FlexBox alignItems="center">
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                    }}
                  >
                    {notificationData?.description?.patient_name?.charAt(1) ||
                      "U"}
                  </Avatar>
                </FlexBox>
                <div>
                  <Paragraph fontWeight={500}>
                    {notificationData?.description?.patient_name || "Unknown"}
                  </Paragraph>
                  <Small ellipsis color="text.secondary">
                    {notificationData.message || "No message available"}
                  </Small>
                </div>
              </FlexBox>
              <FlexBox
                p={2}
                gap={2}
                my={2}
                flexDirection="column"
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Small color="text.secondary">
                  {notificationData.description.call_summary ||
                    "No message available"}
                </Small>
                {notificationData.description.start_time && (
                  <Small color="text.secondary">
                    Start Time:{" "}
                    {functionGetTime(notificationData.description.start_time)}
                  </Small>
                )}
                {notificationData.description.end_time && (
                  <Small color="text.secondary">
                    End Time:{" "}
                    {functionGetTime(notificationData.description.end_time)}
                  </Small>
                )}

                {notificationData.description.topic &&
                  notificationData.description.topic.length > 0 && (
                    <FlexBox gap={1} flexWrap="wrap">
                      {notificationData.description.topic.map(
                        (topic, index) => (
                          <Small
                            key={index}
                            sx={{
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                              padding: "4px 8px",
                              borderRadius: 1,
                            }}
                          >
                            {topic}
                          </Small>
                        )
                      )}
                    </FlexBox>
                  )}
              </FlexBox>
            </div>
          </Box>
        );

      case "instruction":
        return (
          <Box padding={3}>
            <div
              className="notification-details-layout-main"
              style={{ minHeight: "calc(100vh - 260px)" }}
            >
              <div className="notification-details-days-title">
                <H6 fontSize={14}>Instructions</H6>
              </div>
              <FlexBox
                p={2}
                gap={2}
                my={2}
                alignItems="center"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: "transparent",
                }}
              >
                <FlexBox alignItems="center">
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                    }}
                  >
                    {notificationData?.description?.family_name?.charAt(0) ||
                      "U"}
                  </Avatar>
                </FlexBox>
                <div>
                  <Paragraph fontWeight={500}>
                    {notificationData?.description?.family_name || "Unknown"}
                  </Paragraph>
                  <Small ellipsis color="text.secondary">
                    {notificationData.message || "No message available"}
                  </Small>
                </div>
              </FlexBox>
              <FlexBox sx={{color: "secondary.text"}}>
                <Small>{notificationData?.description?.instruction}</Small>
                {notificationData.steps &&
                  notificationData.steps.length > 0 && (
                    <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                      {notificationData.steps.map((step, index) => (
                        <Box component="li" key={index}>
                          <Small color="text.secondary">{step}</Small>
                        </Box>
                      ))}
                    </Box>
                  )}
              </FlexBox>
            </div>
          </Box>
        );

      case "description":
        return (
          <Box padding={3}>
            <div
              className="notification-details-layout-main"
              style={{ minHeight: "calc(100vh - 260px)" }}
            >
              <div className="notification-details-days-title">
                <H6 fontSize={14}>{notificationData.title || "Description"}</H6>
              </div>
              <FlexBox
                p={2}
                gap={2}
                my={2}
                alignItems="center"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: "transparent",
                }}
              >
                <FlexBox alignItems="center">
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                    }}
                  >
                    {notificationData?.description?.family_name?.charAt(0) ||
                      "U"}
                  </Avatar>
                </FlexBox>
                <div>
                  <Paragraph fontWeight={500}>
                    {notificationData?.description?.family_name || "Unknown"}
                  </Paragraph>
                  <Small ellipsis color="text.secondary">
                    {notificationData.message || "No message available"}
                  </Small>
                </div>
              </FlexBox>
              <FlexBox
                p={2}
                gap={2}
                my={2}
                flexDirection="column"
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  maxHeight: "calc(100vh - 400px)",
                  overflow: "auto",
                }}
              >
                {notificationData.description.description && (
                  <Box mt={1}>
                    <Small color="text.secondary">
                      {notificationData.description.description}
                    </Small>
                  </Box>
                )}
              </FlexBox>
            </div>
          </Box>
        );

      default:
        return (
          <Box padding={3}>
            <div className="notification-details-layout-main">
              <div className="notification-details-days-title">
                <H6 fontSize={14}>Notification</H6>
              </div>
              <FlexBox p={2} gap={2} my={2}>
                <Small color="text.secondary">
                  {notificationData.message || "No details available"}
                </Small>
              </FlexBox>
            </div>
          </Box>
        );
    }
  };
  return (
    <Card>
      <Box padding={3}>
        <FlexBox alignItems="center" justifyContent="space-between" gap={1}>
          <H6 fontSize={20}>Notification Details</H6>
          <Button
            onClick={handleBack}
            sx={{
              cursor: "pointer",
              color: "primary",
              display: "flex",
              alignItems: "center",
            }}
          >
            ← Back
          </Button>
        </FlexBox>
      </Box>
      {renderContent()}
    </Card>
  );
}

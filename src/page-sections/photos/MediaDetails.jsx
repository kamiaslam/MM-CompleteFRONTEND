import React, { Fragment, useEffect, useState } from "react";
import { Box, Typography, Card, Divider, ListItem } from "@mui/material";
import { functionGetTime } from "../../helper/constant";
import { ChevronRight } from "@mui/icons-material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Scrollbar from "@/components/scrollbar";
import { GetMediaDetails } from "../../api/axiosApis/get";
import { ToggleBtn } from "../chat/conversation/styles";
import { useLoader } from "../../contexts/LoaderContext";

const MediaDetails = ({ singleCall, handleOpen }) => {
  const [media, setMedia] = useState([]); // Initialize media as an empty array
  const { showLoader, hideLoader } = useLoader();

  const fetchMedia = () => {
    showLoader();
    GetMediaDetails(singleCall)
      .then((data) => {
        setMedia(data?.data || []); // Ensure media is always an array
      })
      .catch((error) => {
        console.error("Error fetching media:", error);
      })
      .finally(() => {
        hideLoader();
      });
  };

  useEffect(() => {
    if (singleCall?.id) {
      fetchMedia();
    }
  }, [singleCall]);

  const aggregatedMedia = media.reduce((acc, mediaItem) => {
    const { file_type, urls } = mediaItem;
    if (!acc[file_type]) {
      acc[file_type] = { file_type, urls: [] };
    }
    acc[file_type].urls.push(...urls);
    return acc;
  }, {});

  const renderMediaPreview = (file, type, index) => {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            type === "audio" ? "1fr" : "repeat(auto-fill, minmax(185px, 1fr))",
          // gap: "10px",
          // padding: "10px",
          textAlign: "center",
        }}
        key={index}
      >
        {file.urls?.map((url, idx) => (
          <Box
            display={"flex"}
            justifyContent={type === "audio" ? "start" : "center"}
            alignItems={"center"}
            key={idx}
          >
            <ListItem
              sx={{
                width: "auto",
                height: type === "audio" ? "auto" : "150px",
              }}
            >
              {type === "image" && (
                <LazyLoadImage
                  height={"100%"}
                  src={url}
                  alt={type}
                  width={"100%"}
                />
              )}
              {type === "video" && (
                <video width="100%" controls style={{ height: "100%" }}>
                  <source src={url} type={"video/mp4"} />
                </video>
              )}
              {type === "audio" && (
                <>
                  <Box>
                    <audio controls>
                      <source src={url} type={"audio/wav"} />
                      Your browser does not support the audio tag.
                    </audio>
                  </Box>
                </>
              )}
            </ListItem>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Fragment>
      <Box position="relative">
        <ToggleBtn screen="md" onClick={handleOpen}>
          <ChevronRight sx={{ fontSize: 16, color: "white" }} />
        </ToggleBtn>
      </Box>
      {singleCall?.id ? (
        <Box style={{ height: "100%" }}>
          <Card variant="outlined" sx={{ padding: 2, mb: 2 }}>
            <Box display="flex" alignItems="center">
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                color="text.primary"
              >
                Call Details
              </Typography>
            </Box>
            <Divider />
            <Box marginX={3} marginTop={2}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  color: "text.primary",
                }}
              >
                <Typography
                  fontSize="15px"
                  fontWeight={"bold"}
                  sx={{ marginRight: 1 }}
                >
                  Title
                </Typography>
                <Typography fontSize="14px">
                  : {singleCall?.call_scheduled_title}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Typography
                  fontSize="15px"
                  fontWeight={"bold"}
                  sx={{ marginRight: 1 }}
                >
                  Start Time
                </Typography>
                <Typography fontSize="14px">
                  :{" "}
                  {singleCall?.start_time
                    ? functionGetTime(singleCall?.start_time)
                    : "-"}
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  fontSize="15px"
                  fontWeight={"bold"}
                  sx={{ marginRight: 1 }}
                >
                  End Time
                </Typography>
                <Typography fontSize="14px">
                  :{" "}
                  {singleCall?.end_time
                    ? functionGetTime(singleCall?.end_time)
                    : "-"}
                </Typography>
              </div>
            </Box>
          </Card>

          <Card
            variant="outlined"
            sx={{ padding: 2 }}
            style={{ height: "calc(100% - 200px)" }}
          >
            <Typography variant="h6">Media</Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.keys(aggregatedMedia).length > 0 ? (
              <Box sx={{ maxHeight: "520px", overflow: "auto" }}>
                {Object.values(aggregatedMedia).map((media, index) => (
                  <Box key={index}>
                    <Typography variant="h6" color="#fff">
                      {media?.file_type?.charAt(0)?.toUpperCase() +
                        media?.file_type?.slice(1)}
                    </Typography>
                    {renderMediaPreview(media, media.file_type, index)}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography
                variant="body2"
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                No Media Records Found
              </Typography>
            )}
          </Card>
        </Box>
      ) : (
        <Card
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" align="center">
            Please select a call from the list to see the details.
          </Typography>
        </Card>
      )}
    </Fragment>
  );
};

export default MediaDetails;

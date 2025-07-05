import { useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Visibility from "@mui/icons-material/Visibility";
import moment from "moment";
import { Box, Chip, IconButton, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Typography, Paper } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import FlexBox from "@/components/flexbox/FlexBox";
import { Paragraph } from "@/components/typography";
export default function MediaTableRow(props) {
  const { user } = props;
  const [openModal, setOpenModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const handleOpenModal = (user) => {
    setSelectedMedia(user);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMedia(null);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    minWidth: "60%",
    maxWidth: "80%",
    minHeight: "90vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    outline: "none",
    borderRadius: "16px",
    overflow: "auto",
  };
  const categorizeMedia = () => {
    const images = [];
    const videos = [];
    const audios = [];

    if (user?.file_url?.length) {
      user.file_url.forEach((url, index) => {
        const mediaType = Array.isArray(user.file_type)
          ? user.file_type[index]
          : user.file_type; // If f.ile_type is an array, match index; else use as-is

        switch (mediaType) {
          case "images":
            images.push(url);
            break;
          case "video":
            videos.push(url);
            break;
          case "audio":
            audios.push(url);
            break;
          default:
            console.warn(
              `Unsupported media type: ${mediaType} for URL: ${url}`
            );
            break;
        }
      });
    }

    return { images, videos, audios };
  };

  const renderMediaSection = (title, media, renderFn) => {
    if (!media.length) return null;

    return (
      <div style={{ marginBottom: "20px" }}>
        <h3>{title}</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "start",
          }}
        >
          {media.map(renderFn)}
        </div>
      </div>
    );
  };

  const renderImage = (url, index) => (
    <>
      <Box
        sx={{
          width: "auto",
          display: "flex",
          alignItems: "center",
          borderRadius: 1,
          border: 2,
          backgroundColor: "gray",
        }}
      >
        <img
          key={index}
          src={url}
          alt={`Media ${index}`}
          style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
        />
      </Box>
    </>
  );

  const renderVideo = (url, index) => (
    <>
      <Box
        sx={{
          width: "auto",
          display: "flex",
          alignItems: "center",
          borderRadius: 1,
          border: 2,
          backgroundColor: "gray",
        }}
      >
        <video
          key={index}
          controls
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    </>
  );

  const renderAudio = (url, index) => (
    <>
      <Box
        sx={{
          width: "auto",
          // height: 200,
          display: "flex",
          alignItems: "center",
          objectFit: "cover",
          borderRadius: 1,
          border: 2,
        }}
      >
        <audio key={index} controls>
          <source src={url} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      </Box>
    </>
  );

  const { images, videos, audios } = categorizeMedia();

  return (
    <TableRow hover>
      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar
            src={user?.avatar || user.family_member_name?.charAt(0)}
            alt={user.family_member_name}
            variant="rounded"
          />

          <div>
            <Paragraph fontWeight={500} color="text.primary">
              {user.family_member_name}
            </Paragraph>
          </div>
        </FlexBox>
      </TableCell>

      <TableCell padding="normal">{user.family_member_email}</TableCell>

      <TableCell padding="normal">
        {moment(user?.created_at).format("DD MMM YYYY")}
      </TableCell>

      <TableCell padding="normal">
        <IconButton onClick={() => handleOpenModal(user)}>
          <Visibility style={{ cursor: "pointer" }} />
        </IconButton>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="media-modal"
          aria-describedby="media-modal-description"
          sx={{
            "& .MuiPaper-root": {
              maxHeight: "90%",
            },
          }}
        >
          <Paper sx={modalStyle}>
            {/* Header Section */}
            <Box
              sx={{
                p: 3,
                pb: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                position: "relative",
              }}
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                Media Details
              </Typography>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "grey.500",
                  "&:hover": {
                    color: "grey.700",
                    bgcolor: "grey.100",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 3 }}>
              {/* Media Information */}
              {selectedMedia && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "primary.main" }}
                  >
                    Information
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      // bgcolor: "grey.50",
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Tag
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: "background.paper",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {selectedMedia.tags ? (
                          Array.isArray(selectedMedia.tags) ? (
                            selectedMedia.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                sx={{
                                  m: 0.5,
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                }}
                              />
                            ))
                          ) : typeof selectedMedia.tags === "string" ? (
                            selectedMedia.tags.split(",").map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag.trim()}
                                sx={{
                                  m: 0.5,
                                  bgcolor: "primary.light",
                                  color: "primary.contrastText",
                                }}
                              />
                            ))
                          ) : (
                            <Typography sx={{ color: "text.secondary" }}>
                              Invalid tag format
                            </Typography>
                          )
                        ) : (
                          <Typography sx={{ color: "text.secondary" }}>
                            No tag available
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {/* 
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Instruction
                      </Typography>
                      <Typography
                        sx={{
                          color: selectedMedia.instructions
                            ? "text.primary"
                            : "text.secondary",
                          bgcolor: "background.paper",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {selectedMedia.instructions ||
                          "No instruction available"}
                      </Typography>
                    </Box> */}

                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Description
                      </Typography>
                      <Typography
                        sx={{
                          color: selectedMedia.description
                            ? "text.primary"
                            : "text.secondary",
                          // bgcolor: "background.paper",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          maxHeight: "200px",
                          overflowY: "auto",
                          "&::-webkit-scrollbar": {
                            width: "8px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0,0,0,.2)",
                            borderRadius: "4px",
                          },
                        }}
                      >
                        {selectedMedia.description ||
                          "No description available"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Media Content */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  Media Content
                </Typography>
                <Box
                  sx={{
                    // bgcolor: "grey.50",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  {selectedMedia &&
                    renderMediaSection(
                      selectedMedia?.file_type === "image"
                        ? "Images"
                        : selectedMedia?.file_type === "audio"
                          ? "Audios"
                          : "Movies",
                      selectedMedia?.file_url,
                      selectedMedia?.file_type === "image"
                        ? renderImage
                        : selectedMedia?.file_type === "audio"
                          ? renderAudio
                          : renderVideo
                    )}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Modal>
      </TableCell>
    </TableRow>
  );
}

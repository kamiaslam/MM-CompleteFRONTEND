import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useEffect, useState } from "react";

import IncomingMsg from "../incoming-msg";
import OutgoingMsg from "../outgoing-msg";
import Scrollbar from "@/components/scrollbar";
import { H6, Small } from "@/components/typography";
import { FlexBetween, FlexBox } from "@/components/flexbox"; // CUSTOM ICON COMPONENT

import { isEmpty } from "../../../helper/constant"; // Utility function to check if data is empty
import { GetCallDetails } from "../../../api/axiosApis/get";
import { ToggleBtn } from "./styles";
import LoaderWithLogo from "../../../components/Loader/LoaderWithLogo";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { IconButton, Modal, Popover } from "@mui/material";
import Emotions from "./Emotions";
import EmotionChart from "./EmotionChart";
import { ChartBarIcon } from "lucide-react";
import { Close } from "@mui/icons-material";
import { useLoader } from "../../../contexts/LoaderContext";

export default function Conversation({ singleCall, handleOpen }) {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // For pagination
  const [hasMore, setHasMore] = useState(true); // To check if more data is available
  const [anchorEl, setAnchorEl] = useState(null);
  const [emotions, setEmotions] = useState([]);

  const { showLoader, hideLoader } = useLoader();

  const handleGetCallDetails = async (obj, pageNumber = 1) => {
    showLoader();
    setLoading(true);
    try {
      const res = await GetCallDetails({ id: obj, page: pageNumber });
      if (res?.success) {
        setMessages((prevMessages) =>
          pageNumber === 1 ? res?.data : [...prevMessages, ...res?.data]
        );

        const emotionsData = res?.data
          ?.filter(
            (msg) =>
              msg?.emotion_features &&
              Object.keys(msg.emotion_features).length > 0
          )
          ?.map((msg) => ({
            timestamp: msg.created_at,
            ...msg.emotion_features,
          }));

        setEmotions((prevEmotions) =>
          pageNumber === 1
            ? emotionsData || []
            : [...prevEmotions, ...(emotionsData || [])]
        );

        // Update hasMore based on whether we've reached the last page
        setHasMore(pageNumber < res?.page_count);
        setLoading(false);
      } else {
        setMessages([]);
        setEmotions([]);
        toast.error(res?.detail || res?.message || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching messages");
    } finally {
      hideLoader();
    }
  };

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleGetCallDetails(singleCall?.id, nextPage);
    }
  };

  useEffect(() => {
    if (singleCall?.id) {
      setMessages([]);
      setPage(1); // Reset page when conversation changes
      setHasMore(true); // Reset hasMore when conversation changes
      handleGetCallDetails(singleCall?.id, 1);



        // setTimeout(() => {
        //   const scrollableDiv = document.getElementById("scrollableDiv");
        //   if (scrollableDiv) {
        //     scrollableDiv.scrollTop = 0; // Reset scroll position to the top
        //   }
        // }, 200);
    }
  }, [singleCall?.id]); // Fetch messages when singleCall id changes

  return (
    <Card className="h-full">
      <FlexBetween padding={3}>
        <FlexBox alignItems="center" gap={1.5}>
          {/* <Avatar src="/static/user/user-19.png" alt="" /> */}
          <div>
            <H6 lineHeight={1} fontSize={20}>
              {singleCall?.id ? singleCall?.call_scheduled_title : "Messages"}
            </H6>
          </div>
        </FlexBox>

        {singleCall?.id && (
          <IconButton
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{ padding: "4px" }}
          >
            <ChartBarIcon />
            {/* <InsertChartIcon /> */}
          </IconButton>
        )}
        <Modal
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "80%",
              height: "80%",
              bgcolor: "transparent", // Added explicit color
              borderRadius: 1,
              p: 2,
              position: "relative", // Needed for absolute positioning
            }}
          >
            <IconButton
              onClick={() => setAnchorEl(null)}
              sx={{
                position: "absolute",
                cursor: "pointer",
                right: 16,
                top: 16,
                zIndex: 1, // Added to ensure button stays on top
              }}
            >
              <Close />
            </IconButton>
            <EmotionChart callId={singleCall?.id} emotions={emotions} />
          </Box>
        </Modal>
      </FlexBetween>

      <Divider />

      <Box position="relative">
        <ToggleBtn screen="md" onClick={handleOpen}>
          <ChevronRight
            sx={{
              fontSize: 16,
              color: "white",
            }}
          />
        </ToggleBtn>

        <Scrollbar
          id="scrollableDiv" 
          style={{
            maxHeight: 710,
            overflow: "auto", 
            display: "flex",
            flexDirection: "column",
          }}
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={loadMoreMessages}
            hasMore={hasMore}
            // loader={<LoaderWithLogo />}
            scrollableTarget="scrollableDiv"
            endMessage=""
            style={{ display: "flex" }}
            inverse={true}
          >
            <Stack spacing={4} px={3} py={2} style={{height: "100%"}}>
              {!singleCall?.id ? (
                <span>Please select a call to see its messages.</span>
              ) : loading && messages.length === 0 ? ( // Only show main loader when no messages
                <LoaderWithLogo />
              ) : messages?.length > 0 ? (
                messages.map((msg, index) =>
                  msg.type === "bot" ? (
                    <IncomingMsg
                      key={index}
                      message={msg.message}
                      time={msg.created_at}
                      name={msg.type}
                    />
                  ) : (
                    <OutgoingMsg
                      key={index}
                      message={msg.message}
                      time={msg.created_at}
                      name={msg.type}
                      emotions={msg?.emotion_features}
                    />
                  )
                )
              ) : (
                <Small>No messages found.</Small>
              )}
            </Stack>
          </InfiniteScroll>
        </Scrollbar>
      </Box>
    </Card>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Divider, IconButton, CircularProgress } from "@mui/material";
import { Call } from "@mui/icons-material";
import { functionGetTime } from "../../helper/constant";
import FlexBox from "@/components/flexbox/FlexBox";
import Scrollbar from "@/components/scrollbar";
import { getCalls } from "../../api/axiosApis/get";
import { useLoader } from "../../contexts/LoaderContext";

export default function SidebarCallHistory({ singleCall, setSingleCall }) {
  const [calls, setCalls] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);

  const { showLoader, hideLoader } = useLoader();

  // Fetch calls based on the page number
  const fetchCalls = async (pageNum) => {
    if (loading) return; // Prevent duplicate API calls
    setLoading(true);
    showLoader();

    try {
      const data = await getCalls(showLoader, hideLoader, pageNum);
      if (data?.data?.length > 0) {
        const newCalls = data?.data;
        setCalls((prev) => [...prev, ...newCalls]); // Append new data to previous calls
        setHasMore(newCalls.length > 0); // Set hasMore based on data length
      } else {
        setHasMore(false); // No more data to load
      }
    } catch (error) {
      console.error("Error fetching calls:", error);
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  // Fetch calls whenever the page number changes
  useEffect(() => {
    fetchCalls(page);
  }, [page]);

  // Handle scrolling to trigger more data fetching when reaching the bottom
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Box mt={3}>
      <FlexBox alignItems="center" gap={1} px={3} mb={1}>
        <Typography variant="h6" align="center" gutterBottom color="text.primary">
          Call History
        </Typography>
      </FlexBox>
      <Divider />

      <Scrollbar style={{ height: "100%", maxHeight: "800px" }}>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{ overflowY: "auto", height: "100%", maxHeight: "700px" }}
        >
          {/* If loading is true, show the loading spinner */}
          {loading && (
            <Box display="flex" justifyContent="center" mt={2} mb={2}>
              <CircularProgress size={24} />
            </Box>
          )}

          {/* If data is loaded and available, render the call items */}
          {!loading && calls.length > 0 ? (
            calls.map((call, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 1,
                  backgroundColor: singleCall?.id === call?.id ? "#e8078d2e" : "transparent",
                  cursor: "pointer",
                  color: singleCall?.id !== call?.id ? "#fff" : "#e8078d",
                  borderRadius: 3,
                  "&:hover": {
                    backgroundColor: "#e8078d2e",
                    color: "#e8078d",
                    "& .MuiSvgIcon-root": { color: "#e8078d" },
                  },
                  marginX: "5px",
                  marginY: "5px",
                  overflow: "hidden",
                }}
                onClick={() => setSingleCall(call)}
              >
                <IconButton sx={{ color: singleCall?.id !== call?.id ? "#ff6484" : "#f12a81" }}>
                  <Call fontSize="medium" />
                </IconButton>

                <Box sx={{ marginLeft: 1 }}>
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 1,
                      maxHeight: "40px",
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "text.primary",
                    }}
                  >
                    {call?.call_scheduled_title}
                  </Typography>
                  <Typography fontSize={"13px"} padding={0} color="text.primary">
                    {functionGetTime(call?.start_time)}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            // Show "No Records Found" only when there are no calls and not loading
            !loading && (
              <Typography variant="body2" align="center" color="text.primary" sx={{ marginTop: 1, marginBottom: 1 }}>
                No Records Found
              </Typography>
            )
          )}
        </div>
      </Scrollbar>
    </Box>
  );
}

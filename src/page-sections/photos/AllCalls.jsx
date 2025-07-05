import Box from "@mui/material/Box";
import Scrollbar from "@/components/scrollbar";
import FlexBox from "@/components/flexbox/FlexBox";
import { Divider, Typography, IconButton, CircularProgress } from "@mui/material";
import { getCalls } from "../../api/axiosApis/get";
import { useState, useEffect, useRef } from "react";
import { useLoader } from "../../contexts/LoaderContext";
import { functionGetTime } from "../../helper/constant";
import { Call } from "@mui/icons-material";

export default function AllCalls({ singleCall, setSingleCall }) {
  const [calls, setCalls] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null); // Use a ref for scrolling

  const { showLoader, hideLoader } = useLoader();

  const fetchCalls = async (pageNum) => {
    if (loading) return; // Prevent duplicate API calls
    setLoading(true);

    try {
      const data = await getCalls(showLoader, hideLoader, pageNum);
      if (data?.data?.length > 0) {
        setCalls((prev) => [...prev, ...data?.data]); // Append new data
        setHasMore(true);
      } else {
        setHasMore(false); // No more data
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls(page);
  }, [page]);

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

      {/* Scrollable Container */}
      <Scrollbar style={{ height: "100%", maxHeight: "800px" }}>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            overflowY: "auto",
            height: "100%",
            maxHeight: "700px", // Make sure it's not conflicting with parent height
          }}
        >
          {calls?.length > 0 ? (
            calls.map((call, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 1,
                  backgroundColor: singleCall?.id === call?.id ? "#e8078d2e" : "transparent",
                  cursor: "pointer",
                  color: singleCall?.id !== call?.id ? "#000" : "#e8078d",
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
                <div>
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
                  <Typography fontSize={"13px"} color="text.primary" padding={0}>
                    {functionGetTime(call?.created_at)}
                  </Typography>
                </div>
              </Box>
            ))
          ) : (
            <Typography variant="body2" align="center" sx={{ marginTop: 1, marginBottom: 1 }}>
              No Records Found
            </Typography>
          )}

          {/* Loading Indicator */}
          {loading && (
            <Box display="flex" justifyContent="center" mt={2} mb={2}>
              <CircularProgress size={24} />
            </Box>
          )}
        </div>
      </Scrollbar>
    </Box>
  );
}

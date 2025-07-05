import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography";
import { format } from "@/utils/currency";
import { fetchTotalUsers } from "../../../api/axiosApis/get"; // Reuse the fetchTotalUsers API
import { useLoader } from "../../../contexts/LoaderContext"; // Assuming a loader context exists
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading spinner

export default function TotalCalls() {
  const [totalCalls, setTotalCalls] = useState(null);
  const { showLoader, hideLoader } = useLoader();

  // Fetch total calls when the component mounts
  useEffect(() => {
    const getTotalCalls = async () => {
      const data = await fetchTotalUsers(showLoader, hideLoader); // Fetch data using the API
      if (data) {
        setTotalCalls(data); // Store the whole response data
      }
    };

    getTotalCalls();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1}>
          {/* Show loading spinner if totalCalls is null */}
          {totalCalls === null ? (
            <CircularProgress size={24} />
          ) : (
            <H6>{format(totalCalls.today_calls_count + totalCalls.week_calls_count + totalCalls.month_calls_count)}</H6>
          )}
        </FlexBox>
        <Paragraph color="text.secondary">Total Calls</Paragraph>
      </div>

      <Box mt={4}>
        {/* Show Today's, Weekly, and Monthly calls dynamically */}
        {totalCalls === null ? (
          <>
            <Paragraph mb={1} fontWeight={500}>
              Today's Calls: <CircularProgress size={16} />
            </Paragraph>
            <Paragraph mb={1} fontWeight={500}>
              Weekly Calls: <CircularProgress size={16} />
            </Paragraph>
            <Paragraph mb={1} fontWeight={500}>
              Monthly Calls: <CircularProgress size={16} />
            </Paragraph>
          </>
        ) : (
          <>
            <Paragraph mb={1} fontWeight={500}>
              Today's Calls: {format(totalCalls.today_calls_count)}
            </Paragraph>
            <Paragraph mb={1} fontWeight={500}>
              Weekly Calls: {format(totalCalls.week_calls_count)}
            </Paragraph>
            <Paragraph mb={1} fontWeight={500}>
              Monthly Calls: {format(totalCalls.month_calls_count)}
            </Paragraph>
          </>
        )}
      </Box>
    </Card>
  );
}

import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography"; // CUSTOM UTILS METHOD
import { fetchTodaysCallData } from "../../../api/axiosApis/get"; 
import { format } from "@/utils/currency";

export default function DailyVisitors() {
  const [callCount, setCallCount] = useState(null); // State for storing call count
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    // Call the fetch function and log the response
    const fetchData = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser"));
        const carehomeId = authUser?.user_info?.id;
        const response = await fetchTodaysCallData(carehomeId);
        // Set the call count from the API response
        setCallCount(response.call_count);
        setLoading(false); // Data fetched, set loading to false
      } catch (error) {
        setError(error); // Set error if something goes wrong
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error: {error.message}</div>; // Show error message

  return (
    <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1}>
          {loading ? <div>Loading...</div>: <H6>{format(callCount)}</H6>}
           {/* Display formatted call count */}
        </FlexBox>

        <Paragraph color="text.secondary">Daily Calls</Paragraph>
      </div>
    </Card>
  );
}

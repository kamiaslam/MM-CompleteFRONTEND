import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup"; // CUSTOM COMPONENTS
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading spinner

import Percentage from "@/components/percentage";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography"; // CUSTOM UTILS METHOD
import { fetchTotalUsers } from "../../../api/axiosApis/get"; // Use the same API that returns all totals
import { format } from "@/utils/currency";
import { useLoader } from "../../../contexts/LoaderContext"; // Assuming a loader context exists

export default function TotalFamilyMembers() {
  const [totalFamilyMembers, setTotalFamilyMembers] = useState(null); // State to store total family members
  const { showLoader, hideLoader } = useLoader(); // Loader context functions

  // Fetch total family members count on component mount
  useEffect(() => {
    const getTotalFamilyMembers = async () => {
      const data = await fetchTotalUsers(showLoader, hideLoader); // Fetch data using the API
      if (data) {
        setTotalFamilyMembers(data.family_members_count); // Extracting family_members_count from the response
      }
    };

    getTotalFamilyMembers(); // Call the function to fetch data
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1}>
          {/* Show loading spinner while data is being fetched */}
          {totalFamilyMembers === null ? (
            <CircularProgress size={24} />
          ) : (
            <H6>{format(totalFamilyMembers)}</H6> // Display the total family members count when data is available
          )}
        </FlexBox>

        <Paragraph color="text.secondary">Total Family Members</Paragraph>
      </div>

      <Box mt={7}>
        <Paragraph mb={0.5} fontWeight={500}>
          Newly Added
        </Paragraph>

        <AvatarGroup max={3}>
          <Avatar alt="Remy Sharp" src="/static/user/user-11.png" />
          <Avatar alt="Travis Howard" src="/static/user/user-10.png" />
          <Avatar alt="Cindy Baker" src="/static/user/user-13.png" />
          <Avatar alt="Agnes Walker" src="/static/user/user-14.png" />
          <Avatar alt="Trevor Henderson" src="/static/user/user-15.png" />
        </AvatarGroup>
      </Box>
    </Card>
  );
}

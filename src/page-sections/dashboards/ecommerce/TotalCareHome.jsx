import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup"; // CUSTOM COMPONENTS
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading spinner

import Percentage from "@/components/percentage";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography"; // CUSTOM UTILS METHOD
import { fetchTotalUsers } from "../../../api/axiosApis/get";
import { format } from "@/utils/currency";
import { useLoader } from "../../../contexts/LoaderContext";

export default function TotalCareHome() {
  const [totalCareHomes, setTotalCareHomes] = useState(null);

  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    // Fetch total users (care homes) when the component mounts
    const getTotalCareHomes = async () => {
      const data = await fetchTotalUsers(showLoader, hideLoader);
      if (data) {
        setTotalCareHomes(data.carehome_count); // Extracting carehome_count from the response
      }
    };

    getTotalCareHomes();
  }, []); // Empty array means this will run only once when the component mounts

  return (
    <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1}>
          {/* Show a loading spinner when data is not available */}
          {totalCareHomes === null ? (
            <CircularProgress size={24} />
          ) : (
            <H6>{format(totalCareHomes)}</H6> // Use dynamic value here
          )}
        </FlexBox>

        <Paragraph color="text.secondary">Total Care Homes</Paragraph>
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

import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { nanoid } from "nanoid";
import { fetchOtherFamilyMembersLastSeen } from "../../../../api/axiosApis/get"; // New fetch function
import { Paragraph, Small } from "@/components/typography";
import { FlexBetween, FlexBox } from "@/components/flexbox";
import { useLoader } from "../../../../contexts/LoaderContext";

export default function OtherFamilyMembersLastSeenSection() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [error, setError] = useState(null);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const familyMemberId = authUser?.user_info?.id;

  if (!familyMemberId) {
    return <Paragraph>Family Member ID not found in localStorage</Paragraph>;
  }

  const getOtherFamilyMembers = () => {
    setLoading(true);
    setError(null);

    fetchOtherFamilyMembersLastSeen(familyMemberId, showLoader, hideLoader)
      .then((response) => {
        console.log(response);
        // Use the response array directly since it's an array of family members
        setFamilyMembers(response || []);
      })
      .catch((err) => {
        console.error("Error fetching other family members' last seen:", err);
        setError("Failed to load data");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (familyMemberId) {
      getOtherFamilyMembers();
    }
  }, [familyMemberId]);

  // Utility function to format UTC date strings to local date/time.
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Check if the dateString ends with a 'Z' or contains a timezone offset (+HH:MM or -HH:MM)
    const hasTimezone = /Z|[+-]\d{2}:?\d{2}$/.test(dateString);
    // If no timezone indicator is found, assume the date is in UTC and append "Z"
    const utcDateString = hasTimezone ? dateString : dateString + "Z";
    try {
      return new Date(utcDateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZoneName: "short",
      });
    } catch (error) {
      console.error("Advanced date formatting not supported, falling back.", error);
      return new Date(utcDateString).toLocaleString();
    }
  };

  return (
    <Card className="p-3 h-full">
      <FlexBetween>
        <Paragraph fontSize={18} fontWeight={500}>
          Other Family Members
        </Paragraph>
      </FlexBetween>

      <FlexBetween mt={3} mb={2}>
        <Paragraph color="text.secondary" fontWeight={500}>
          Profile
        </Paragraph>
        <Paragraph color="text.secondary" fontWeight={500}>
          Last Seen
        </Paragraph>
      </FlexBetween>

      {loading ? (
        <Paragraph>Loading...</Paragraph>
      ) : error ? (
        <Paragraph color="error">{error}</Paragraph>
      ) : (
        <Stack spacing={2.5}>
          {familyMembers.length > 0 ? (
            familyMembers.map((item) => (
              <FlexBetween key={nanoid()}>
                <FlexBox gap={1.5} alignItems="center">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar
                      alt={item.name}
                      src={item.image || "/static/user/default-avatar.png"}
                      sx={{ width: 45, height: 45 }}
                    />
                  </Badge>

                  <div>
                    <Paragraph lineHeight={1} fontWeight={600}>
                      {item.name}
                    </Paragraph>
                    {/* You may uncomment this if you want to display relation */}
                    {/* <Small fontWeight={500} color="text.secondary">
                      {item.relation || "Unknown"}
                    </Small> */}
                  </div>
                </FlexBox>

                <Paragraph fontWeight={500} color="text.secondary">
                  {item.last_seen ? formatDate(item.last_seen) : "N/A"}
                </Paragraph>
              </FlexBetween>
            ))
          ) : (
            <Paragraph>No family members found.</Paragraph>
          )}
        </Stack>
      )}
    </Card>
  );
}

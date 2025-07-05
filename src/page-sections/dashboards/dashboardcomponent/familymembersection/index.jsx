import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { nanoid } from "nanoid"; // Custom Components
import { fetchFamilyMembers } from "../../../../api/axiosApis/get"; // Import the fetch function
import { Paragraph, Small } from "@/components/typography";
import { FlexBetween, FlexBox } from "@/components/flexbox"; // Custom Utility Methods
import { useLoader } from "../../../../contexts/LoaderContext";
export default function Familymembersection() {
  // State to hold family members data, loading state, and any error message
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showLoader, hideLoader } = useLoader(); // Access loader functions from context
  const [error, setError] = useState(null);

  // Get the authUser data from localStorage
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  // Extract patientId from authUser data (user_info.id)
  const patientId = authUser?.user_info?.id;

  // If patientId is not found in localStorage, return an error message
  if (!patientId) {
    return <Paragraph>Patient ID not found in localStorage</Paragraph>;
  }

  // Fetch family members based on the patientId
  const getFamilyMembers = () => {
    setLoading(true);
    setError(null); // Reset error before making a new request

    fetchFamilyMembers(patientId, showLoader, hideLoader) // Assuming the function accepts a patientId as an argument
      .then((response) => {
        setFamilyMembers(response.family_member_data || []); // Set the family members data (family_member_data is the key)
      })
      .catch((err) => {
        console.error("Error fetching family members:", err);
        setError("Failed to load family members"); // Set error state
      })
      .finally(() => {
        setLoading(false); // Stop loading after the request is complete
      });
  };

  // Fetch family members when the component is mounted
  useEffect(() => {
    if (patientId) {
      getFamilyMembers();
    }
  }, [patientId]);

  return (
    <Card className="p-3 h-full">
      <FlexBetween>
        <Paragraph fontSize={18} fontWeight={500}>
          Family Member
        </Paragraph>

        {/* MoreButton component can be added if needed */}
      </FlexBetween>

      <FlexBetween mt={3} mb={2}>
        <Paragraph color="text.secondary" fontWeight={500}>
          Profile
        </Paragraph>
        <Paragraph color="text.secondary" fontWeight={500}>
          {/* Last used */}
        </Paragraph>
      </FlexBetween>

      {loading ? (
        <Paragraph>Loading...</Paragraph> // Show loading message when data is being fetched
      ) : error ? (
        <Paragraph color="error">{error}</Paragraph> // Show error message if there's an error
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
                      src={item.image || "/static/user/default-avatar.png"} // Use default image if no image exists
                      sx={{
                        width: 45,
                        height: 45,
                      }}
                    />
                  </Badge>

                  <div>
                    <Paragraph lineHeight={1} fontWeight={600}>
                      {item.name}
                    </Paragraph>
                    <Small fontWeight={500} color="text.secondary">
                      {item.relation || "Unknown"} {/* Display relation if available */}
                    </Small>
                  </div>
                </FlexBox>

                <Paragraph fontWeight={500} color="text.secondary">
                {item.last_seen ? new Date(item.last_seen + "Z").toLocaleString() : "N/A"}
                </Paragraph>
              </FlexBetween>
            ))
          ) : (
            <Paragraph>No family members found.</Paragraph> // Message if no family members are returned
          )}
        </Stack>
      )}
    </Card>
  );
}

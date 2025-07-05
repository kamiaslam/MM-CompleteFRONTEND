import { useEffect } from "react";
import { useCarehomeSentiment } from "../../../contexts/CarehomeSentimentContext"; // Import the context hook
import Card from "@mui/material/Card";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography"; // CUSTOM UTILS METHOD
import { format } from "@/utils/currency";

export default function TotalCareHomeCalmCalls() {
  const { sentimentData, loading, error } = useCarehomeSentiment(); // Access the context

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const calmCalls = sentimentData?.sentiment.neutrals; // Access the specific data (adjust based on the API response structure)

  return (
    <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1}>
          {loading? <div>Loading...</div> : <H6>{format(calmCalls)}</H6>}
        </FlexBox>

        <Paragraph color="text.secondary">Calm Calls</Paragraph>
      </div>
    </Card>
  );
}

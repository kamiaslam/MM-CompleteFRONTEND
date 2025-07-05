import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress'; // CUSTOM COMPONENTS

import Title from '@/components/title';
import { Paragraph } from '@/components/typography';
import FlexBetween from '@/components/flexbox/FlexBetween';
export default function YearlyRevenue() {
  return (
    <Card
      sx={{
        padding: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Title
          title={`70%`}
          percentage="-1.25%"
          percentageType="success"
          subtitle="Sadness"
        />
      </div>

      <Box mt={7}>
        <FlexBetween mb={1}>
          <Paragraph fontWeight={600}>70% of the daily goal</Paragraph>
          <Paragraph color="text.secondary">79%</Paragraph>
        </FlexBetween>

        <LinearProgress
          value={65}
          color="primary"
          variant="determinate"
          sx={{
            height: 8,
          }}
        />
      </Box>
    </Card>
  );
}
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress'; // CUSTOM COMPONENTS

import Title from '@/components/title';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { Paragraph } from '@/components/typography';
export default function YearlySales() {
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
          title={`40%`}
          percentage="-1.25%"
          percentageType="error"
          subtitle="Negative thoughts"
        />
      </div>

      <Box mt={7}>
        <FlexBetween mb={1}>
          <Paragraph fontWeight={600}>35% of the daily goal</Paragraph>
          <Paragraph color="text.secondary">75%</Paragraph>
        </FlexBetween>

        <LinearProgress
          value={79}
          color="success"
          variant="determinate"
          sx={{
            height: 8,
          }}
        />
      </Box>
    </Card>
  );
}
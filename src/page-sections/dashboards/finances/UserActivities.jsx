import Card from '@mui/material/Card';
import useTheme from '@mui/material/styles/useTheme';
import merge from 'lodash.merge';
import Chart from 'react-apexcharts';
// CUSTOM COMPONENTS
import { Paragraph } from '@/components/typography';
import MoreButton from '@/components/more-button';
import FlexBetween from '@/components/flexbox/FlexBetween'; // CUSTOM UTILS METHOD

import { baseChartOptions } from '@/utils/baseChartOptions';

export default function UserActivity() {
  const theme = useTheme(); // REACT CHART DATA SERIES

  const chartSeries = [{
    name: 'Daily Logins', // Track daily logins or calls made
    data: [120, 291, 145, 180, 250, 170, 220, ] // Example data
  }]; // REACT CHART CATEGORIES LABEL (e.g., daily activity for 12 days)

  const chartCategories = ["Feb 14,2025", 'Feb 15,2025', 'Feb 16,2025', 'Feb 17,2025', 'Feb 18,2025', 'Feb 19,25', 'Feb 20,25']; // Weekdays

  const chartOptions = merge(baseChartOptions(theme), {
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider
    },
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]], // Original color scheme
    xaxis: {
      categories: chartCategories, // Days of the week for the x-axis
      crosshairs: {
        show: true
      },
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      min: 0,
      show: true,
      max: 300, // Adjust according to expected activity level
      tickAmount: 5,
      labels: {
        formatter: value => value + '', // Customize label text
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  });

  return (
    <Card sx={{ pt: 3, px: 2, pb: 1 }}>
      <FlexBetween px={2}>
        <Paragraph fontSize={18} fontWeight={500}>
          User Activity
        </Paragraph>
        <MoreButton size="small" />
      </FlexBetween>

      <Chart type="area" height={300} series={chartSeries} options={chartOptions} />
    </Card>
  );
}

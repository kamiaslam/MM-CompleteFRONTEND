import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import useTheme from '@mui/material/styles/useTheme';
import merge from 'lodash.merge';
import Chart from 'react-apexcharts';
// CUSTOM COMPONENTS
import MoreButton from '@/components/more-button';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { Paragraph } from '@/components/typography'; // CUSTOM UTILS METHOD

import { baseChartOptions } from '@/utils/baseChartOptions'; // ==============================================================

// ==============================================================
export default function RevenueOverview({
  type = 'line'
}) {
  const theme = useTheme(); // REACT CHART CATEGORIES LABEL

  const chartCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // Monthly Categories

  const chartSeries = [{
    name: 'Revenue',
    data: [10000, 125000, 145000, 75000, 100000, 115000, 140000, 165000, 155000, 160000, 170000, 180000] // Example static monthly revenue data
  }]; // REACT CHART OPTIONS

  const chartOptions = merge(baseChartOptions(theme), {
    colors: [theme.palette.primary.main], // Color for the revenue line
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider
    },
    xaxis: {
      crosshairs: {
        show: false
      },
      categories: chartCategories,
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
      max: 200000, // Adjust max if needed
      tickAmount: 5,
      labels: {
        formatter: value => `$${value.toLocaleString()}`, // Formatting revenue in $$
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter: val => `$${val.toLocaleString()}` // Tooltip format
      }
    },
    chart: {
      stacked: false
    },
    stroke: {
      show: true,
      width: 3, // Adjusted width for the line
      colors: [theme.palette.primary.main] // Line color for revenue
    },
    legend: {
      show: true,
      position: 'top',
      fontSize: '14px',
      itemMargin: {
        horizontal: 12
      },
      fontFamily: theme.typography.fontFamily,
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: false
      },
      markers: {
        shape: 'circle',
        strokeWidth: 0,
        size: 6,
        offsetX: -2
      }
    },
    ...(type === 'line' && {
      responsive: [{
        breakpoint: 550,
        options: {
          chart: {
            height: 450
          }
        }
      }]
    })
  });
  return (
    <Card>
      <FlexBetween mb={2} px={3} pt={3}>
        <Paragraph fontSize={18} fontWeight={500}>
          Revenue Overview
        </Paragraph>

        <MoreButton size="small" />
      </FlexBetween>

      <Box px={1}>
        <Chart type={type} height={275} options={chartOptions} series={chartSeries} />
      </Box>
    </Card>
  );
}

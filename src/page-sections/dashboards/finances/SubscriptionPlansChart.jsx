import Card from '@mui/material/Card';
import useTheme from '@mui/material/styles/useTheme';
import merge from 'lodash.merge';
import Chart from 'react-apexcharts';
// CUSTOM COMPONENTS
import MoreButton from '@/components/more-button';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { Paragraph } from '@/components/typography'; // CUSTOM UTILS METHOD

import { baseChartOptions } from '@/utils/baseChartOptions';
export default function SubscriptionPlansChart() {
  const theme = useTheme(); // REACT CHART OPTIONS

  const chartOptions = merge(baseChartOptions(theme), {
    labels: ['Basic', 'Intermediate', 'Custom'],
    colors: [
      theme.palette.primary.main,       // Basic plan color
      theme.palette.success.main,       // Intermediate plan color
      '#FF6347',                        // Custom plan color (changed to Tomato Red)
    ],
    stroke: {
      width: 0
    },
    legend: {
      show: true,
      fontSize: '14px',
      position: 'bottom',
      itemMargin: {
        horizontal: 12
      },
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: false
      },
      markers: {
        strokeWidth: 0,
        size: 6,
        offsetX: -2
      }
    },
    tooltip: {
      style: {
        fontSize: '14px'
      },
      y: {
        title: name => name,
        formatter: val => `${val}`
      }
    }
  });

  return (
    <Card className="p-3 h-full">
      <FlexBetween mb={4}>
        <Paragraph fontSize={18} fontWeight={500}>
          Subscription Plans
        </Paragraph>

        <MoreButton size="small" />
      </FlexBetween>

      <div>
        <Chart type="pie" height={265} series={[130, 65, 45]} options={chartOptions} />
      </div>
    </Card>
  );
}

import useTheme from '@mui/material/styles/useTheme';
import merge from 'lodash.merge';
import Chart from 'react-apexcharts';
// CUSTOM COMPONENTS
import { expressionColors } from "@/utils/expressionColors";

import { baseChartOptions } from '@/utils/baseChartOptions';
export default function Sales({ emotionFeatures }) {
  const theme = useTheme(); // REACT CHART CATEGORIES LABEL
  
  const keys = Object.keys(emotionFeatures);
  
  const array = Object.keys(emotionFeatures).map((item) => emotionFeatures[item])
  const minValue = Math.min(...array);
  const maxValue = Math.max(...array);
  const chartCategories = keys

  const chartSeries = [{
    name: 'Sales',
    data: array
  }]; // REACT CHART OPTIONS

  const chartOptions = merge(baseChartOptions(theme), {
    stroke: {
      width: 0
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider
    },
    colors: keys.map(key => expressionColors[key] || theme.palette.primary.main),
    xaxis: {
      categories: chartCategories,
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary
        },
        offsetY: 5,
        rotateAlways: false,
        hideOverlappingLabels: false,
        showDuplicates: true,
        trim: false,
      },
      tickAmount: keys.length - 1,
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      }
    },
    yaxis: {
      min: minValue,
      show: true,
      max: maxValue,
      tickAmount: 5,
      labels: {
        formatter: value => value.toFixed(2), // Removed the /1000 and 'K' suffix
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '17%',
        borderRadiusApplication: 'end'
      }
    },
    tooltip: {
      y: {
        formatter: function (val, {
          dataPointIndex,
          w
        }) {
          return `${w.globals.labels[dataPointIndex]} : ${val.toFixed(2)}`;
        }
      }
    },
    chart: {
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    }
  });
  return <Chart type="bar" height={495} series={chartSeries} options={chartOptions} />;
}
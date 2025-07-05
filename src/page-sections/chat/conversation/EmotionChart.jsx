import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import useTheme from "@mui/material/styles/useTheme";
import merge from "lodash.merge";
import Chart from "react-apexcharts";
// CUSTOM COMPONENTS

import { baseChartOptions } from "@/utils/baseChartOptions";
import { expressionColors } from "../../../utils/expressionColors";

export default function EmotionChart({ emotions }) {
  const theme = useTheme();

  // Process the time series data
  const processEmotions = () => {
    if (!emotions || !emotions.length) return [];

    // Get the latest emotion reading
    const latestEmotion = emotions[emotions.length - 1];

    // Remove timestamp and process emotion values
    const emotionEntries = Object.entries(latestEmotion)
      .filter(([key]) => key !== "timestamp") // Exclude timestamp
      .map(([label, score]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        score: parseFloat(score), // Convert to percentage
      }))
      .sort((a, b) => b.score - a.score);

    return emotionEntries;
  };

  const emotionData = processEmotions();

  const chartSeries = [
    {
      name: "Emotions",
      data: emotionData.map((emotion) => emotion.score),
    },
  ];

  const chartOptions = merge(baseChartOptions(theme), {
    chart: {
      background: "transparent",
      toolbar: { show: false },
    },
    stroke: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        columnWidth: "55%",
        distributed: true,
      },
    },
    xaxis: {
      categories: emotionData.map((emotion) => emotion.label),
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary,
        },
        offsetY: 5,
        rotateAlways: false,
        hideOverlappingLabels: false,
        showDuplicates: true,
        trim: false,
      },
      tickAmount: emotionData.length - 1,
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
    //   min: minValue,
      show: true,
    //   max: maxValue,
      tickAmount: 5,
      labels: {
        formatter: (value) => value.toFixed(2), // Removed the /1000 and 'K' suffix
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val, { dataPointIndex, w }) => {
          return `${w.globals.labels[dataPointIndex]}: ${val.toFixed(2)}%`;
        },
      },
    },
    grid: { show: false },
    colors: emotionData.map(
      (emotion) => expressionColors[emotion.label] || theme.palette.primary.main
    ),
  });

  return (
    <Card style={{ height: "100%" }}>
      {emotionData.length > 0 ? (
        <Chart
          type="bar"
          series={chartSeries}
          options={chartOptions}
          height="100%"
        />
      ) : (
        <Box p={2} textAlign="center">
          No emotion data available
        </Box>
      )}
    </Card>
  );
}

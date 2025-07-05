import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import useTheme from "@mui/material/styles/useTheme";
import merge from "lodash.merge";
import Chart from "react-apexcharts";
// CUSTOM COMPONENTS
import Title from "@/components/title"; // CUSTOM UTILS METHODS

import { baseChartOptions } from "@/utils/baseChartOptions";

export default function Emotions({ emotions }) {
  const theme = useTheme();

  // Transform object into array format and get top 4 emotions
  const emotionData = emotions
    ? Object.entries(emotions)
        .map(([label, score]) => ({
          label: label.charAt(0).toUpperCase() + label.slice(1), // Capitalize first letter
          score: parseFloat(score),
        }))
        .sort((a, b) => b.score - a.score) // Sort by score in descending order
        .slice(0, 5) // Get only top 4
    : [];


  const chartSeries = [
    {
      name: "Emotions",
      data: emotionData.map((emotion) => emotion.score),
    },
  ];

  const chartOptions = merge(baseChartOptions(theme), {
    chart: {
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
        columnWidth: "25%", // Reduced column width to make bars even thinner
        distributed: true, // Enables individual bar colors
        barDistance: -90, // Reduces the space between bars
      },
    },

    xaxis: {
      categories: emotionData.map((emotion) => emotion.label),
      labels: {
        style: {
          fontSize: "12px", // Reduced font size for the x-axis labels to save space
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val, { dataPointIndex, w }) => {
          return `${w.globals.labels[dataPointIndex]}: ${val.toFixed(2)}%`;
        },
      },
      style: {
        fontSize: "10px", // Adjust font size
        backgroundColor: "#fff", // Set background color
        color: "#000", // Set text color
      },
      onDatasetHover: {
        highlightDataSeries: true, // Highlight the series on hover
      },
      // theme: "light", // Set tooltip theme
      // marker: {
      //   show: true, // Show marker
      // },
    },
    grid: {
      show: false, // Hide grid lines for a cleaner, more compact look
    },
    colors: [theme.palette.secondary.main],
  });

  return (
    <Card
      sx={{ height: 100, width: 230, p: 0 }}
      style={{
        backgroundColor: "#ffffff42",
      }}
    >
      <Chart
        type="bar"
        series={chartSeries}
        options={chartOptions}
        height={120} // Adjust height to make it compact
      />
    </Card>
  );
}

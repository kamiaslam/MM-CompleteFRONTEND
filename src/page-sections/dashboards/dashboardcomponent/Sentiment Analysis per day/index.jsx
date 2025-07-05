import { useEffect, useState } from "react";
import { fetchPatientSentimentDataPerDay } from "../../../../api/axiosApis/get";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import useTheme from "@mui/material/styles/useTheme";
import merge from "lodash.merge";
import Chart from "react-apexcharts";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";

// CUSTOM COMPONENTS
import FlexBetween from "@/components/flexbox/FlexBetween";
import { Paragraph } from "@/components/typography";
import { baseChartOptions } from "@/utils/baseChartOptions";

export default function SentimentAnalysisSectionPerday({ type = "bar" }) {
  const theme = useTheme();
  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const FamilyMemberId = authUser?.user_info?.id;

  useEffect(() => {
    if (FamilyMemberId && selectedDate) {
      setLoading(true);
      fetchPatientSentimentDataPerDay(
        FamilyMemberId,
        selectedDate.format("YYYY-MM-DD")
      )
        .then((data) => {
          setSentimentData({
            positive: data.sentiments.positives || 0,
            negative: data.sentiments.negatives || 0,
            neutral: data.sentiments.neutrals || 0,
          });
        })
        .catch((err) => {
          console.error("Error fetching patient sentiment data:", err);
          setError("Failed to load sentiment data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [FamilyMemberId, selectedDate]);

  const sentimentCategories = ["Positive", "Negative", "Neutral"];
  const dynamicSentimentData = {
    Positive: sentimentData.positive,
    Negative: sentimentData.negative,
    Neutral: sentimentData.neutral,
  };

  const maxValue = Math.max(...Object.values(dynamicSentimentData));
  const tickAmount = 5;

  // Use different colors for each sentiment
  const chartSeries = [
    {
      name: "Sentiment Analysis",
      data: [
        dynamicSentimentData.Positive,
        dynamicSentimentData.Negative,
        dynamicSentimentData.Neutral,
      ],
    },
  ];

  const chartOptions = merge(baseChartOptions(theme), {
    colors: [
      theme.palette.success.main,   // Positive
      theme.palette.error.main,      // Negative
      theme.palette.grey[500],       // Neutral
    ],
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
    },
    xaxis: {
      crosshairs: { show: false },
      categories: sentimentCategories,
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      min: 0,
      show: true,
      max: maxValue,
      tickAmount: tickAmount,
      labels: {
        formatter: (value) => value,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      x: { show: false },
      y: { formatter: (val) => `${val}` },
    },
    chart: { stacked: false },
    stroke: {
      show: true,
      ...(type === "bar" && {
        width: 3,
        colors: ["transparent"],
      }),
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "14px",
      itemMargin: { horizontal: 12 },
      fontFamily: theme.typography.fontFamily,
      onItemClick: { toggleDataSeries: false },
      onItemHover: { highlightDataSeries: false },
      markers: {
        shape: "circle",
        strokeWidth: 0,
        size: 6,
        offsetX: -2,
      },
    },
    ...(type === "bar" && {
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "43%",
          borderRadiusApplication: "end",
        },
      },
      responsive: [
        {
          breakpoint: 550,
          options: {
            chart: { height: 450 },
            plotOptions: { bar: { horizontal: true } },
            xaxis: {
              min: 0,
              max: maxValue,
              tickAmount: tickAmount,
              labels: {
                formatter: (value) => value,
                style: { colors: theme.palette.text.secondary },
              },
              show: true,
            },
            yaxis: {
              labels: {
                style: {
                  fontWeight: 500,
                  colors: theme.palette.text.secondary,
                  fontFamily: theme.typography.fontFamily,
                },
              },
              show: true,
            },
          },
        },
      ],
    }),
  });

  return (
    <Card>
      {/* Title Section */}
      <FlexBetween mb={2} px={3} pt={3}>
        <Paragraph fontSize={18} fontWeight={500}>
          Sentiment Analysis
        </Paragraph>
      </FlexBetween>

      {/* Date Picker */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3 }}
      >
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="call_date"
            type="date"
            label="Select Date"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& input": {
                cursor: "pointer",
              },
            }}
            value={selectedDate.format("YYYY-MM-DD")}
            onChange={(e) => {
              const newDate = dayjs(e.target.value);
              setSelectedDate(newDate);
            }}
            inputProps={{
              min: "2000-01-01", // You can set this to a specific start date if necessary
              max: dayjs().format("YYYY-MM-DD"), // Set max date to today
            }}
          />
        </Grid>
      </Grid>

      {/* Chart */}
      <Box px={1}>
        {error && <Paragraph color="error">{error}</Paragraph>}
        {loading ? (
          <Paragraph>Loading...</Paragraph>
        ) : (
          <Chart
            type={type}
            height={275}
            options={chartOptions}
            series={chartSeries}
          />
        )}
      </Box>
    </Card>
  );
}



import { useEffect, useState } from "react";
import { fetchPatientSentimentData } from "../../../../api/axiosApis/get";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import useTheme from '@mui/material/styles/useTheme';
import merge from 'lodash.merge';
import Chart from 'react-apexcharts';
// CUSTOM COMPONENTS

import FlexBetween from '@/components/flexbox/FlexBetween';
import { Paragraph } from '@/components/typography'; // CUSTOM UTILS METHOD

import { baseChartOptions } from '@/utils/baseChartOptions'; // ==============================================================

export default function SentimentAnalysisSection({
  type = 'bar'
}) {
  const theme = useTheme(); // REACT CHART CATEGORIES LABEL

  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [error, setError] = useState(null);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const patientId = authUser?.user_info?.id;

  useEffect(() => {
    if (patientId) {
      fetchPatientSentimentData(patientId)
        .then((data) => {
          setSentimentData({
            positive: data.sentiment.positives ,
            negative: data.sentiment.negatives ,
            neutral: data.sentiment.neutrals ,
          });
        })
        .catch((err) => {
          console.error("Error fetching patient sentiment data:", err);
          setError("Failed to load sentiment data");
        });
    }
  }, [patientId]);

  const sentimentCategories = ['Positive', 'Negative', 'Neutral']; 

  // Dynamically use the fetched sentiment data
  const dynamicSentimentData = {
    Positive: sentimentData.positive,
    Negative: sentimentData.negative,
    Neutral: sentimentData.neutral
  };

  // Calculate the maximum value from the sentiment data
  const maxValue = Math.max(...Object.values(dynamicSentimentData));

  // Dynamically determine the tickAmount based on the max value
  const tickAmount = 5 

  // Define the chart series
  const chartSeries = [{
    name: 'Sentiment Analysis',
    data: [
      dynamicSentimentData.Positive,  // Positive sentiment value
      dynamicSentimentData.Negative,  // Negative sentiment value
      dynamicSentimentData.Neutral    // Neutral sentiment value
    ]
  }];

  // REACT CHART OPTIONS
  const chartOptions = merge(baseChartOptions(theme), {
    colors: [theme.palette.success.main, theme.palette.error.main, theme.palette.grey[500]], // Customize colors for Positive, Negative, and Neutral
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider
    },
    xaxis: {
      crosshairs: {
        show: false
      },
      categories: sentimentCategories,  // Update categories to Positive, Negative, Neutral
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
      max: maxValue,  // Dynamically set max based on the data
      tickAmount: tickAmount,  // Dynamically adjust tick amount based on max value
      labels: {
        formatter: value => value,  // No formatting, just show the raw value
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
        formatter: val => `${val}` // Show the raw value without formatting
      }
    },
    chart: {
      stacked: false
    },
    stroke: {
      show: true,
      ...(type === 'bar' && {
        width: 3,
        colors: ['transparent']
      })
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
    ...(type === 'bar' && {
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '43%',
          borderRadiusApplication: 'end'
        }
      },
      responsive: [{
        breakpoint: 550,
        options: {
          chart: {
            height: 450
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          xaxis: {
            min: 0,
            show: true,
            max: maxValue,  // Dynamically set max based on the data
            tickAmount: tickAmount,  // Dynamically adjust tick amount based on max value
            labels: {
              formatter: value => value, // Show raw value on x-axis
              style: {
                colors: theme.palette.text.secondary
              }
            }
          },
          yaxis: {
            show: true,
            labels: {
              style: {
                fontWeight: 500,
                colors: theme.palette.text.secondary,
                fontFamily: theme.typography.fontFamily
              }
            }
          }
        }
      }]
    })
  });

  return (
    <Card>
      <FlexBetween mb={2} px={3} pt={3}>
        <Paragraph fontSize={18} fontWeight={500}>
          Sentiment Analysis
        </Paragraph>

        
      </FlexBetween>

      <Box px={1}>
        <Chart type={type} height={275} options={chartOptions} series={chartSeries} />
      </Box>
    </Card>
  );
}

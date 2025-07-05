import Card from "@mui/material/Card";
import useTheme from "@mui/material/styles/useTheme";
import LinearProgress from "@mui/material/LinearProgress";
import merge from "lodash.merge";
import Chart from "react-apexcharts";
import { fetchUserMemory } from "../../../../api/axiosApis/get";
import { fetchPatientSentimentData } from "../../../../api/axiosApis/get"; // Import the new function
import { useLoader } from "../../../../contexts/LoaderContext";
// CUSTOM COMPONENTS
import MoreButton from "@/components/more-button";
import FlexBetween from "@/components/flexbox/FlexBetween";
import { Paragraph } from "@/components/typography"; // CUSTOM UTILS METHOD

import { baseChartOptions } from "@/utils/baseChartOptions";
import { useEffect, useState } from "react";
import "./memorystyles.css";

export default function Memorysection() {
  const { showLoader, hideLoader } = useLoader(); // Access loader functions from context
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  // Extract patientId from authUser data (user_info.id)
  const patientId = authUser?.user_info?.id;

  if (!patientId) {
    return <Paragraph>Patient ID not found in localStorage</Paragraph>;
  }

  const [userMemory, setUserMemory] = useState(null);  // State to store user memory
  const [sentimentData, setSentimentData] = useState({ positive: 0, negative: 0, neutral: 0 }); // State to store sentiment data
  const [error, setError] = useState(null);           // State for error handling

  // Get patient memory and show/hide loader accordingly
  const getPatientMemory = () => {
    showLoader();  // Show loader when API call starts

    fetchUserMemory(patientId)
      .then((response) => {
        setUserMemory(response.user_memory); // Set the user memory to state
      })
      .catch((err) => {
        console.error("Error fetching user memory:", err);
        setError("Failed to load user memory"); // Set error state
      })
      .finally(() => {
        hideLoader(); // Hide loader after the API call completes
      });
  };

  // Fetch sentiment data and update the state
  const getPatientSentimentData = () => {
    showLoader(); // Show loader when API call starts

    fetchPatientSentimentData(patientId, showLoader, hideLoader)
      .then((data) => {
        // Assuming data contains positive_count, negative_count, neutral_count
        setSentimentData({
          positive: data.positive_count || 0,
          negative: data.negative_count || 0,
          neutral: data.neutral_count || 0,
        });
      })
      .catch((err) => {
        console.error("Error fetching patient sentiment data:", err);
      })
      .finally(() => {
        hideLoader(); // Hide loader after the API call completes
      });
  };

  // Fetch user memory and sentiment data when the component is mounted
  useEffect(() => {
    if (patientId) {
      getPatientMemory(); // Fetch memory data
      getPatientSentimentData(); // Fetch sentiment data
    }
  }, [patientId]);

  const theme = useTheme(); // REACT CHART OPTIONS

  const chartOptions = merge(baseChartOptions(theme), {
    chart: {
      type: 'bar', // Change chart type to bar
    },
    plotOptions: {
      bar: {
        horizontal: false, // Set horizontal/vertical bar
        columnWidth: '60%',
      },
    },
    colors: [
      theme.palette.success.main, // Positive
      theme.palette.error.main,   // Negative
      theme.palette.grey[500],    // Neutral
    ],
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val}`,
      },
    },
    xaxis: {
      categories: ['Sentiment'], // Only one category (sentiment)
    },
  });

  // Handle error state in UI
  if (error) {
    return <Paragraph>{error}</Paragraph>;
  }

  return (
    <Card className="p-3 alignment-in-column" style={{ height: "100%" }}>
      <FlexBetween>
        <Paragraph fontSize={18} fontWeight={500}>
          Sentiment Analysis
        </Paragraph>

        {/* <MoreButton size="small" /> */}
      </FlexBetween>

      <div style={{ position: "relative" }}>
        {/* Bar chart for sentiment data */}
        <Chart
          type="bar"
          height={250}
          series={[
            {
              name: "Positive",
              data: [sentimentData.positive],
            },
            {
              name: "Negative",
              data: [sentimentData.negative],
            },
            {
              name: "Neutral",
              data: [sentimentData.neutral],
            },
          ]}
          options={chartOptions}
        />
      </div>

      <div>
        <Paragraph lineHeight={1.2} fontSize={20} fontWeight={500}>
          {userMemory ? `${userMemory}%` : "0%"} {/* Display user memory if available */}
        </Paragraph>

        <Paragraph mb={0.5} color="text.secondary">
          Accumulative score - Last 5 days calls.
        </Paragraph>

        <LinearProgress
          value={userMemory || 0}  // Use the fetched user memory value for progress bar
          variant="determinate"
          sx={{
            height: 8,
          }}
        />
      </div>
    </Card>
  );
}

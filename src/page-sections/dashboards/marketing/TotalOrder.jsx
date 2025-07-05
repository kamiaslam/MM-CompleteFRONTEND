// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import useTheme from '@mui/material/styles/useTheme';
// import merge from 'lodash.merge';
// import Chart from 'react-apexcharts';
// // CUSTOM COMPONENT
// import Title from '@/components/title'; // CUSTOM UTILS METHODS

// import { baseChartOptions } from '@/utils/baseChartOptions';
// export default function TotalOrder() {
//   const theme = useTheme(); // REACT CHART CATEGORIES LABEL

//   const chartCategories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']; // REACT CHART DATA SERIES

//   const chartSeries = [{
//     name: 'Tasks',
//     data: [72, 30, 26, 60, 66, 30, 82]
//   }]; // REACT CHART OPTIONS

//   const chartOptions = merge(baseChartOptions(theme), {
//     stroke: {
//       show: false
//     },
//     xaxis: {
//       categories: chartCategories
//     },
//     colors: [theme.palette.divider, theme.palette.primary.main],
//     plotOptions: {
//       bar: {
//         borderRadius: 5,
//         distributed: true,
//         columnWidth: '40%',
//         borderRadiusApplication: 'end'
//       }
//     },
//     tooltip: {
//       y: {
//         formatter: (val, {
//           dataPointIndex,
//           w
//         }) => {
//           return `${w.globals.labels[dataPointIndex]} : ${val}`;
//         }
//       }
//     }
//   });
//   return (
//     <Card>
//       <Box p={3} pb={0}>
//         <Title title={`70%`} subtitle="Calmness" percentage="+10.02%" />
//       </Box>

//       <Chart
//         type="bar"
//         series={chartSeries}
//         options={chartOptions}
//         height={130}
//       />
//     </Card>
//   );
// }



import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup"; // CUSTOM COMPONENTS

import Percentage from "@/components/percentage";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography"; // CUSTOM UTILS METHOD

import { format } from "@/utils/currency";
export default function TotalOrder() {
  return (
    <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1}>
          <H6>{format(5)}</H6>
        </FlexBox>

        <Paragraph color="text.secondary">Positive Calls</Paragraph>
      </div>

      {/* <Box mt={7}>
        <Paragraph mb={0.5} fontWeight={500}>
          Today's Calls
        </Paragraph>

        <AvatarGroup max={3}>
          <Avatar alt="Remy Sharp" src="/static/user/user-11.png" />
          <Avatar alt="Travis Howard" src="/static/user/user-10.png" />
          <Avatar alt="Cindy Baker" src="/static/user/user-13.png" />
          <Avatar alt="Agnes Walker" src="/static/user/user-14.png" />
          <Avatar alt="Trevor Henderson" src="/static/user/user-15.png" />
        </AvatarGroup>
      </Box> */}
    </Card>
  );
}

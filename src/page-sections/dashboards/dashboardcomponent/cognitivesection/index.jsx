// import Card from "@mui/material/Card";
// import LinearProgress from "@mui/material/LinearProgress";
// import styled from "@mui/material/styles/styled";
// import { useTranslation } from "react-i18next"; // CUSTOM COMPONENTS

// import { H6, Paragraph } from "@/components/typography";
// import { FlexBox, FlexBetween } from "@/components/flexbox";
// import MoreButton from "@/components/more-button";
// import "./resultstyles.css";

// // const RESULTS = [
// //   {
// //     id: 1,
// //     progress: 40,
// //     title: "Admiration",
// //     date: "20 March",
// //   },
// //   {
// //     id: 2,
// //     progress: 80,
// //     title: "Negative thoughts",
// //     date: "15 March",
// //   },
// //   {
// //     id: 3,
// //     progress: 60,
// //     title: "Calmness",
// //     date: "10 March",
// //   },
// //   {
// //     id: 4,
// //     progress: 90,
// //     title: "Sadness",
// //     date: "1 March",
// //   },
// //   {
// //     id: 5,
// //     progress: 80,
// //     title: "Admiration",
// //     date: "5 March",
// //   },
// //   {
// //     id: 6,
// //     progress: 80,
// //     title: "Admiration",
// //     date: "5 March",
// //   },
// //   {
// //     id: 7,
// //     progress: 80,
// //     title: "Admiration",
// //     date: "5 March",
// //   },
// //   {
// //     id: 8,
// //     progress: 80,
// //     title: "Admiration",
// //     date: "5 March",
// //   },
// //   {
// //     id: 9,
// //     progress: 80,
// //     title: "Admiration",
// //     date: "5 March",
// //   },
// // ]; // STYLED COMPONENTS

// const StyledRoot = styled(Card)(({ theme }) => ({
//   height: "100%",
//   padding: theme.spacing(3),
//   "& .dot": {
//     width: 10,
//     height: 10,
//     flexShrink: 0,
//     borderRadius: "50%",
//     backgroundColor: theme.palette.primary.main,
//   },
//   "& .progress-wrapper": {
//     flexGrow: 1,
//     marginInline: "1rem",
//   },
//   "& .title": {
//     overflow: "hidden",
//   },
// }));
// export default function Cognitivesection({ emotionFeatures }) {
  
//   const { t } = useTranslation();
//    // Calculate min and max dynamically
//    const minValue = Math.min(...values);
//    const maxValue = Math.max(...values);
//     // Map input data to RESULTS format
//     const RESULTS = Object.keys(emotionFeatures).map((key, index) => ({
//       id: index + 1,
//       title: t(key), // Translate emotion label
//       progress: Math.min(Math.max(emotionFeatures[key], 0), 1), // Ensure progress is within 0-100
//     }));
//   return (
//     <div className="resultssection-main">
//         <StyledRoot>
//         {/* <H6 fontSize={14} lineHeight={1}>
//           {t("Cognitive Mood Score")}
//         </H6> */}
//       <FlexBetween>
//        <H6 fontSize={14} lineHeight={1}>
//           {t("Cognitive Mood Score")}
//         </H6>
//         <MoreButton size="small" />
//       </FlexBetween>
//         {/* <Paragraph mt={0.5} color="text.secondary">
//           Accumulative score based on last 5 days conversations.
//         </Paragraph> */}

//         {RESULTS.map((item) => (
//           <FlexBetween mt={2} key={item.id}>
//             <FlexBox gap={1} alignItems="center" width={100}>
              

//               <div className="title">
//                 <Paragraph ellipsis fontWeight={500}>
//                   {item.title}
//                 </Paragraph>
//               </div>
//             </FlexBox>

//             <div className="progressdiv-results">
//               <Paragraph fontWeight={500}>{item.progress}%</Paragraph>
//               <div className="progress-wrapper" style={{ height: "8px" }}>
//                 <LinearProgress variant="determinate" value={item.progress} />
//               </div>
//             </div>
//           </FlexBetween>
//         ))}
//       </StyledRoot>
//     </div>
//   );
// }
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import styled from "@mui/material/styles/styled";
import { useTranslation } from "react-i18next"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "@/components/typography";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import MoreButton from "@/components/more-button";
import "./resultstyles.css";

const RESULTS = [
  {
    id: 1,
    progress: 40,
    title: "Admiration",
    date: "20 March",
  },
  {
    id: 2,
    progress: 80,
    title: "Negative thoughts",
    date: "15 March",
  },
  {
    id: 3,
    progress: 60,
    title: "Calmness",
    date: "10 March",
  },
  {
    id: 4,
    progress: 90,
    title: "Sadness",
    date: "1 March",
  },
  
]; // STYLED COMPONENTS

const StyledRoot = styled(Card)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(3),
  "& .dot": {
    width: 10,
    height: 10,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
  },
  "& .progress-wrapper": {
    flexGrow: 1,
    marginInline: "1rem",
  },
  "& .title": {
    overflow: "hidden",
  },
}));
export default function Cognitivesection() {
  const { t } = useTranslation();
  return (
    <div className="resultssection-main">
        <StyledRoot>
        {/* <H6 fontSize={14} lineHeight={1}>
          {t("Cognitive Mood Score")}
        </H6> */}
      <FlexBetween>
       <H6 fontSize={14} lineHeight={1}>
          {t("Cognitive Mood Score")}
        </H6>
        {/* <MoreButton size="small" /> */}
      </FlexBetween>
        <Paragraph mt={0.5} color="text.secondary">
          Accumulative score based on last 5 days conversations.
        </Paragraph>

        {RESULTS.map((item) => (
          <FlexBetween mt={2} key={item.id}>
            <FlexBox gap={1} alignItems="center" width={100}>
              {/* <div className="dot" /> */}

              <div className="title">
                <Paragraph ellipsis fontWeight={500}>
                  {item.title}
                </Paragraph>

                {/* <Paragraph ellipsis fontSize={12}>
                {item.date}
              </Paragraph> */}
              </div>
            </FlexBox>

            <div className="progressdiv-results">
              <Paragraph fontWeight={500}>{item.progress}%</Paragraph>
              <div className="progress-wrapper" style={{ height: "8px" }}>
                <LinearProgress variant="determinate" value={item.progress} />
              </div>
            </div>
          </FlexBetween>
        ))}
      </StyledRoot>
    </div>
  );
}

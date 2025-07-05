import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar"; // CUSTOM COMPONENTS

import FlexBox from "@/components/flexbox/FlexBox";
import { Paragraph, Span } from "@/components/typography"; // STYLED COMPONENT

import { Text } from "./styles";
import moment from "moment";
import Emotions from "../conversation/Emotions";
import { functionGetTime } from "../../../helper/constant";
export default function OutgoingMsg({ message, time, name, emotions }) {
  const formattedTime = moment
    ?.utc(time)
    ?.local()
    ?.format("hh:mm:ss A");
  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };
  return (
    <Box
      alignSelf="end"
      maxWidth={{
        md: "90%",
        sm: "70%",
        xs: "80%",
      }}
    >
      <FlexBox justifyContent="end" alignItems="center" mb={1} gap={1.5}>
        <Paragraph fontWeight={600} lineHeight={1}>
          <Span ml={0.5} fontSize={12} fontWeight={400} color="text.secondary">
            {formattedTime}
          </Span>{" "}
          {name}
        </Paragraph>

        <div className="profile-icon">{getFirstLetter(name)}</div>
      </FlexBox>

      <FlexBox alignItems="center" gap={2}>
        <Text>
          {message}
          {emotions && (
            <Box sx={{ minWidth: "120px" }}>
              <Emotions emotions={emotions} />
            </Box>
          )}
        </Text>
      </FlexBox>
    </Box>
  );
}

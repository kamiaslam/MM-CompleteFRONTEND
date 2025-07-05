import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar"; // CUSTOM COMPONENTS
import FlexBox from "@/components/flexbox/FlexBox";
import { Paragraph, Span } from "@/components/typography"; // STYLED COMPONENT
import { Text } from "./styles";
import moment from "moment";

export default function IncomingMsg({ message, time, name }) {
  const formattedTime = moment?.utc(time)?.local()?.format("hh:mm:ss A");
  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <Box
      maxWidth={{
        md: "60%",
        sm: "70%",
        xs: "80%",
      }}
    >
      <FlexBox alignItems="center" mb={1} gap={1.5}>
        {/* Profile Icon, this can be dynamic as well */}
        <div className="profile-icon">{getFirstLetter(name)}</div>
        <Paragraph fontWeight={600} lineHeight={1}>
          {name}
          <Span ml={0.5} fontSize={12} fontWeight={400} color="text.secondary">
            {formattedTime}
          </Span>
        </Paragraph>
      </FlexBox>

      {/* Dynamic message text */}
      <Text>{message}</Text>
    </Box>
  );
}

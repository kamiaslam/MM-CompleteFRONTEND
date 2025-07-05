import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup"; // CUSTOM COMPONENTS

import Percentage from "@/components/percentage";
import FlexBox from "@/components/flexbox/FlexBox";
import { H6, Paragraph } from "@/components/typography"; // CUSTOM UTILS METHOD

import { format } from "@/utils/currency";
export default function TotalSubAdmin() {
  return (
    <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1}>
          <H6>{format(10)}</H6>
        </FlexBox>

        <Paragraph color="text.secondary">Sub Admins</Paragraph>
      </div>

      <Box mt={7}>
        <Paragraph mb={0.5} fontWeight={500}>
          Newly Added
        </Paragraph>

        <AvatarGroup max={3}>
          <Avatar alt="Remy Sharp" src="/static/user/user-11.png" />
          <Avatar alt="Travis Howard" src="/static/user/user-10.png" />
          <Avatar alt="Cindy Baker" src="/static/user/user-13.png" />
          <Avatar alt="Agnes Walker" src="/static/user/user-14.png" />
          <Avatar alt="Trevor Henderson" src="/static/user/user-15.png" />
        </AvatarGroup>
      </Box>
    </Card>
  );
}

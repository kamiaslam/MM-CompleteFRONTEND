import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CameraAlt from "@mui/icons-material/CameraAlt";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallIcon from "@mui/icons-material/Call";

import InfoItem from "./InfoItem";
import AvatarBadge from "@/components/avatar-badge";
import AvatarLoading from "@/components/avatar-loading";
import { FlexBetween, FlexBox } from "@/components/flexbox";
import { H6 } from "@/components/typography";

import { ContentWrapper } from "../styles";
import { Avatar } from "@mui/material";

export default function UserInfo({ adminData }) {

  return (
    <ContentWrapper>
      <FlexBox justifyContent="center">
        <Avatar sx={{ width: 100, height: 100 }}>
          <H6>{adminData?.administrator_name.charAt(0) || "A"}</H6>
        </Avatar>

        {/* <AvatarBadge
          badgeContent={
            <label htmlFor="icon-button-file">
              <input
                type="file"
                accept="image/*"
                id="icon-button-file"
                style={{
                  display: "none",
                }}
              />

              <IconButton aria-label="upload picture" component="span">
                <CameraAlt
                  sx={{
                    fontSize: 16,
                    color: "grey.400",
                  }}
                />
              </IconButton>
            </label>
          }
        >
         
          <AvatarLoading
            borderSize={2}
            percentage={60}
            src={adminData?.administrator_name?.charAt(0)}
            alt="Team Member"
            sx={{
              backgroundColor: "#000",
              width: 100,
              height: 100,
            }}
          >
            {adminData?.administrator_name.charAt(0) || "C"}
          </AvatarLoading>
        </AvatarBadge> */}
      </FlexBox>

      <Box mt={2}>
        <H6 fontSize={18} textAlign="center">
          {adminData?.administrator_name}
        </H6>

        <FlexBetween maxWidth={250} flexWrap="wrap" margin="auto" mt={1}>
          <InfoItem
            Icon={MailOutlineIcon}
            title={`Email :- ${adminData?.email}`}
          />
          <InfoItem
            Icon={CallIcon}
            title={`Phone  :-${adminData?.phone_number}`}
          />
        </FlexBetween>

        {/* <FlexBetween marginTop={6} flexWrap="wrap">
          <ProgressWrapper>
            <Paragraph mb={0.5}>Profile Completion</Paragraph>

            <FlexBox alignItems="center" gap={1}>
              <LinearProgress
                value={60}
                color="success"
                variant="determinate"
              />
              <Small fontWeight={500}>60%</Small>
            </FlexBox>
          </ProgressWrapper>

          <FlexBox gap={1}>
            <Button size="small" color="secondary">
              Follow
            </Button>

            <Button size="small">Hire Me</Button>

            <Button
              size="small"
              color="secondary"
              sx={{
                minWidth: 0,
              }}
            >
              <MoreHoriz fontSize="small" />
            </Button>
          </FlexBox>
        </FlexBetween> */}
      </Box>
    </ContentWrapper>
  );
}

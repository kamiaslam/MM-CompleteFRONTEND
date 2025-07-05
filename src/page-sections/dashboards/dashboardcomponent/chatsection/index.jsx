import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import styled from "@mui/material/styles/styled";
import { useTranslation } from "react-i18next";
import { Typography, Box, Grid, Avatar } from "@mui/material";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import MoreButton from "@/components/more-button";
import profileimage from "../../../../../public/static/dashboardimages/memoryimage.png";
import   reboart   from "../../../../../public/static/avatar/001-man.svg"
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

export default function Chatsection() {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ width: "100%" }}>
      <StyledRoot>
        <FlexBetween>
          <Typography variant="h6" fontSize={14} lineHeight={1}>
            {t("Last Chat Transcript")}
          </Typography>
          {/* You can enable MoreButton if needed */}
          {/* <MoreButton size="small" /> */}
        </FlexBetween>

        <Box sx={{ mt: 2, height: "75vh", overflowY: "auto" }}>
          <Grid container direction="column" spacing={2}>
            {/* Sender's chat */}
            <Grid item>
              <FlexBox alignItems="flex-start" justifyContent="flex-end">
                <Box sx={{ maxWidth: "80%",  alignItems:"flex-end"}}>
                  <Typography variant="caption">Lisa</Typography>
                  <Typography variant="body2">How’s my favourite person doing today</Typography>
                </Box>
                <Avatar src={reboart} alt="Lisa" sx={{ width: 32, height: 32, marginLeft: 1 }} />
              </FlexBox>
            </Grid>

            {/* Receiver's chat */}
            <Grid item>
              <FlexBox alignItems="flex-start">
                <Avatar src={profileimage} alt="James Lee" sx={{ width: 32, height: 32, marginRight: 1 }} />
                <Box sx={{ maxWidth: "80%" }}>
                  <Typography variant="caption">James Lee</Typography>
                  <Typography variant="body2">Who’s this.... ahh</Typography>
                  
                </Box>
              </FlexBox>
            </Grid>

            {/* Sender's chat */}
            <Grid item>
              <FlexBox alignItems="flex-start" justifyContent="flex-end">
                <Box sx={{ maxWidth: "80%" }}>
                  <Typography variant="caption">Lisa</Typography>
                  <Typography variant="body2">It’s okay! James its me Lisa</Typography>
                </Box>
                <Avatar src={reboart} alt="James Lee" sx={{ width: 32, height: 32, marginLeft: 1 }} />
              </FlexBox>
            </Grid>

            {/* Receiver's chat */}
            <Grid item>
              <FlexBox alignItems="flex-start">
                <Avatar src={profileimage} alt="James Lee" sx={{ width: 32, height: 32, marginRight: 1 }} />
                <Box sx={{ maxWidth: "80%" }}>
                  <Typography variant="caption">James Lee</Typography>
                  <Typography variant="body2">I don’t remember you. Who’re you and why you’re calling me?</Typography>
                  
                </Box>
              </FlexBox>
            </Grid>

            {/* Sender's chat */}
            <Grid item>
              <FlexBox alignItems="flex-start" justifyContent="flex-end">
                <Box sx={{ maxWidth: "80%" }}>
                  <Typography variant="caption">Lisa</Typography>
                  <Typography variant="body2">
                    It’s okay James, I am here to chat with you we have lot to catch up. Do you want me to tell you a new story about young James Lee?
                  </Typography>
                  
                </Box>
                <Avatar src={reboart} alt="James Lee" sx={{ width: 32, height: 32, marginLeft: 1 }} />
              </FlexBox>
            </Grid>
            {/* Receiver's chat */}
            <Grid item>
              <FlexBox alignItems="flex-start">
                <Avatar src={profileimage} alt="James Lee" sx={{ width: 32, height: 32, marginRight: 1 }} />
                <Box sx={{ maxWidth: "80%" }}>
                  <Typography variant="caption">James Lee</Typography>
                  <Typography variant="body2">I don’t remember you. Who’re you and why you’re calling me?</Typography>
                  
                </Box>
              </FlexBox>
            </Grid>

            {/* Sender's chat */}
            <Grid item>
              <FlexBox alignItems="flex-start" justifyContent="flex-end">
                <Box sx={{ maxWidth: "80%" }}>
                  <Typography variant="caption">Lisa</Typography>
                  <Typography variant="body2">
                    It’s okay James, I am here to chat with you we have lot to catch up. Do you want me to tell you a new story about young James Lee?
                  </Typography>
                  
                </Box>
                <Avatar src={reboart} alt="James Lee" sx={{ width: 32, height: 32, marginLeft: 1 }} />
              </FlexBox>
            </Grid>
          </Grid>
        </Box>
      </StyledRoot>
    </Box>

  );
}

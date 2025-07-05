import { Fragment, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallIcon from "@mui/icons-material/Call";

import AvatarBadge from "@/components/avatar-badge";
import AvatarLoading from "@/components/avatar-loading";
import { FlexBetween, FlexBox } from "@/components/flexbox"; // ICON COMPONENTS
import { H6 } from "@/components/typography";
import ListItem from "./ListItem";

import CreateIcon from "@mui/icons-material/Create";

import { getProfileList } from "../../api/axiosApis/get";
import { useLoader } from "../../contexts/LoaderContext";
import { Avatar } from "@mui/material";

const ContentWrapper = styled("div")({
  zIndex: 1,
  padding: 24,
  marginTop: 55,
  position: "relative",
});
const CoverPicWrapper = styled("div")({
  top: 0,
  left: 0,
  height: 125,
  width: "100%",
  overflow: "hidden",
  position: "absolute",
});
const StyledFlexBetween = styled(FlexBetween)({
  margin: "auto",
  flexWrap: "wrap",
});
export default function Layout({ children, handleTabList }) {
  const [adminData, setAdminData] = useState(null);
  const { showLoader, hideLoader } = useLoader();
  useEffect(() => {
    showLoader();
    getProfileList()
      .then((resp) => {
        setAdminData(resp?.data);
      })
      .finally(() => {
        hideLoader();
      });
  }, []);
  return (
    <Fragment>
      <Card
        sx={{
          position: "relative",
        }}
      >
        <CoverPicWrapper style={{ position: "relative" }}>
          <img
            width="100%"
            height="100%"
            alt="Team Member"
            src="/static/cover/user-cover-pic.png"
            style={{
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
            }}
          >
            <Link to={"/dashboard/account"}>
              <CreateIcon />
            </Link>
          </div>
        </CoverPicWrapper>

        <ContentWrapper>
          <FlexBox justifyContent="center">
            <Avatar sx={{ width: 100, height: 100 }}>
              <H6>{adminData?.administrator_name.charAt(0) || "C"}</H6>
            </Avatar>

            {/* <AvatarBadge>
              <AvatarLoading
                alt="user"
                borderSize={2}
                percentage={60}
                src="/static/user/user-11.png"
                sx={{
                  width: 100,
                  height: 100,
                }}
              />
            </AvatarBadge> */}
          </FlexBox>

          <Box mt={2}>
            <H6 fontSize={18} textAlign="center">
              {adminData?.administrator_name}
            </H6>

            <StyledFlexBetween paddingTop={1} maxWidth={250}>
              <ListItem
                Icon={MailOutlineIcon}
                title={`Email :- ${adminData?.email}`}
              />
              <ListItem
                Icon={CallIcon}
                title={`Phone  :-${adminData?.phone_number}`}
              />
            </StyledFlexBetween>
          </Box>
        </ContentWrapper>
      </Card>
    </Fragment>
  );
}

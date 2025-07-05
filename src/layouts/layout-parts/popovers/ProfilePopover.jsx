import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ButtonBase from "@mui/material/ButtonBase";
import styled from "@mui/material/styles/styled";
import PopoverLayout from "./PopoverLayout";
import FlexBox from "@/components/flexbox/FlexBox";
import AvatarLoading from "@/components/avatar-loading";
import { H6, Small } from "@/components/typography";
import useAuth from "@/hooks/useAuth";
import { isDark } from "@/utils/constants";
import { useWebSocketContext } from "../../../api/WebSocketProvider";
import { getSession } from "../../../helper/authHelper";
import Modal from "@mui/material/Modal";
import { styled as muiStyled } from "@mui/material/styles";
import { Button } from "@mui/material";

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  marginLeft: 8,
  borderRadius: 30,
  border: `1px solid ${theme.palette.grey[isDark(theme) ? 800 : 200]}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledSmall = styled(Box)(({ theme }) => ({
  fontSize: 13,
  display: "block",
  cursor: "pointer",
  padding: "5px 1rem",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledModal = muiStyled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ModalContent = muiStyled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "400px",
  position: "relative",
  outline: "none",
}));

export default function ProfilePopover() {
  const { user } = useAuth();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { disconnectWebSocket } = useWebSocketContext() ?? {};
  const userInfo = getSession();
  const userRole = userInfo?.role;
  const handleMenuItem = (path) => () => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    disconnectWebSocket();
    navigate("/login");
    localStorage.clear();
  };
  const UserName = userInfo?.user_info?.name
    ? userInfo?.user_info?.name
    : userInfo?.user_info?.first_name && userInfo?.user_info?.last_name
      ? userInfo?.user_info?.first_name + " " + userInfo?.user_info?.last_name
      : userInfo?.role;
  return (
    <Fragment>
      <StyledButtonBase ref={anchorRef} onClick={() => setOpen(true)}>
        <Avatar sx={{ width: 35, height: 35, bgcolor: "primary.main" }}>{user?.name?.[0]?.toUpperCase()}</Avatar>
      </StyledButtonBase>

      <PopoverLayout
        hiddenViewButton
        maxWidth={230}
        minWidth={200}
        popoverOpen={open}
        anchorRef={anchorRef}
        popoverClose={() => setOpen(false)}
        title={
          <FlexBox alignItems="center" gap={1}>
            <Avatar sx={{ width: 35, height: 35, bgcolor: "primary.main" }}>{UserName?.[0]?.toUpperCase()}</Avatar>
            <div>
              <H6 fontSize={14}> {UserName || "Guest user"}</H6>
              <Small color="text.secondary" display="block">
                {user.email || "No email available"}
              </Small>
            </div>
          </FlexBox>
        }
      >
        <Box pt={1}>
          {/* {userRole == "care_home" && <StyledSmall onClick={handleMenuItem("/dashboard/profile")}>Profile</StyledSmall>} */}
          {userRole != "patient" && (
            <StyledSmall onClick={handleMenuItem(`/dashboard/account?tab=${userRole == "care_home" ? "Basic+Information" : "Notifications"}`)}>
              Account
            </StyledSmall>
          )}

          {userRole !== "patient" && <Divider sx={{ my: 1 }} />}

          <StyledSmall onClick={() => setLogoutModalOpen(true)}>Log Out</StyledSmall>

          <StyledModal open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
            <ModalContent>
              <H6 mb={2}>Confirm Logout</H6>
              <Small fontSize={14} mb={3} display="block">
                Are you sure you want to log out?
              </Small>
              <FlexBox gap={2} justifyContent="flex-end">
                <Button variant="outlined" color="primary" onClick={() => setLogoutModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleLogout();
                    setLogoutModalOpen(false);
                  }}
                >
                  Log Out
                </Button>
              </FlexBox>
            </ModalContent>
          </StyledModal>
        </Box>
      </PopoverLayout>
    </Fragment>
  );
}

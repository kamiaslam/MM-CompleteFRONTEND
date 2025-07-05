import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled'; // LAYOUT BASED HOOK

import useLayout from '@/layouts/layout-1/context/useLayout'; // CUSTOM COMPONENTS

import MultiLevelMenu from './MultiLevelMenu';
import Scrollbar from '@/components/scrollbar';
import UserAccount from '@/layouts/layout-parts/UserAccount';
import LayoutDrawer from '@/layouts/layout-parts/LayoutDrawer'; // STYLED COMPONENTS
import { useContext } from "react";
import { SettingsContext } from "@/contexts/settingsContext";
const NavWrapper = styled('div')({
  height: '100%',
  paddingLeft: 16,
  paddingRight: 16
});
export default function MobileSidebar() {
  const {
    showMobileSideBar,
    handleCloseMobileSidebar
  } = useLayout();
    const { settings } = useContext(SettingsContext);

  return (
    <LayoutDrawer open={showMobileSideBar} onClose={handleCloseMobileSidebar}>
      <Scrollbar
        autoHide
        clickOnTrack={false}
        sx={{
          overflowX: "hidden",
          height: "100%",
        }}
      >
        <NavWrapper>

          {settings.theme == "dark" ? (
            <Box
              pl={1}
              pt={3}
              alt="logo"
              maxWidth={45}
              component="img"
              src="/static/logo/logo-svg.svg"
            />
          ) : (
            <Box
              pl={1}
              pt={3}
              alt="logo"
              maxWidth={45}
              component="img"
              src="/static/logo/logo-svg-dark.svg"
            />
          )}

          {/* NAVIGATION ITEMS */}
          <MultiLevelMenu sidebarCompact={false} />

          {/* USER ACCOUNT INFORMATION */}
          {/* <UserAccount /> */}
        </NavWrapper>
      </Scrollbar>
    </LayoutDrawer>
  );
}
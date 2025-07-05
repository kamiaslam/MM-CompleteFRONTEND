import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton"; // LAYOUT BASED HOOK

import useLayout from "@/layouts/layout-1/context/useLayout"; // CUSTOM COMPONENTS

import MultiLevelMenu from "./MultiLevelMenu";
import Link from "@/components/link";
import Scrollbar from "@/components/scrollbar";
import FlexBetween from "@/components/flexbox/FlexBetween";
import UserAccount from "@/layouts/layout-parts/UserAccount"; // CUSTOM ICON COMPONENT
import { useContext } from "react";
import { SettingsContext } from "@/contexts/settingsContext";
import ArrowLeftToLine from "@/icons/duotone/ArrowLeftToLine"; // STYLED COMPONENTS
import useAuth from "@/hooks/useAuth";

import { SidebarWrapper } from "@/layouts/layout-1/styles";
const TOP_HEADER_AREA = 70;
export default function DashboardSidebar() {
  const { sidebarCompact, handleSidebarCompactToggle } = useLayout();
  const [onHover, setOnHover] = useState(false); // ACTIVATE COMPACT WHEN TOGGLE BUTTON CLICKED AND NOT ON HOVER STATE
  const { settings } = useContext(SettingsContext);

  const { user } = useAuth();
  function convertToReadableName(snakeCaseName) {
    if (!snakeCaseName) return "";

    // Split the string by underscore
    const words = snakeCaseName.split("_");

    // Capitalize the first letter of each word
    const readableName = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return readableName;
  }

  const COMPACT = sidebarCompact && !onHover ? 1 : 0;
  return (
    <SidebarWrapper
      compact={sidebarCompact ? 1 : 0}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => sidebarCompact && setOnHover(false)}
    >
      <FlexBetween padding="1.5rem 1rem .5rem 1.8rem" height={TOP_HEADER_AREA}>
        {/* LOGO */}
        <Link href="/dashboard">
          <FlexBetween gap="8px">
            {settings.theme == "dark" ? (
              <Box
                component="img"
                src="/static/logo/logo-svg.svg"
                alt="logo"
                width={30}
              />
            ) : (
              <Box
                component="img"
                src="/static/logo/logo-svg-dark.svg"
                alt="logo"
                width={30}
              />
            )}
            <div className="dashboard-sidebar-logo-text">
              {!COMPACT ? <h2>MIND META AI</h2> : null}
              {!COMPACT ? (
                <p>
                  {/* {convertToReadableName(user?.name)} -{" "} */}
                  {convertToReadableName(user?.role)}
                </p>
              ) : null}
            </div>
          </FlexBetween>
        </Link>

        {/* SIDEBAR COLLAPSE BUTTON */}
        {!COMPACT ? (
          <IconButton onClick={handleSidebarCompactToggle}>
            <ArrowLeftToLine />
          </IconButton>
        ) : null}
      </FlexBetween>

      <Scrollbar
        autoHide
        clickOnTrack={false}
        sx={{
          overflowX: "hidden",
          maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
        }}
      >
        <Box height="100%" px={2}>
          {/* NAVIGATION ITEMS */}
          <MultiLevelMenu sidebarCompact={!!COMPACT} />

          {/* USER ACCOUNT INFO */}
          {/* {!COMPACT ? <UserAccount /> : null} */}
        </Box>
      </Scrollbar>
    </SidebarWrapper>
  );
}

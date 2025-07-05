import { Fragment } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Scrollbar from "@/components/scrollbar";
import { H6, Paragraph } from "@/components/typography";
import useLayout from "@/layouts/layout-2/context/useLayout";
import { navigation } from "@/layouts/layout-2/context/navigation";
import {
  Dot,
  LogoBox,
  MainMenu,
  SubMenuItem,
  NavItemButton,
  SecondarySideBar,
  MobileSidebarWrapper,
} from "@/layouts/layout-2/styles";
import { useContext } from "react";
import { SettingsContext } from "@/contexts/settingsContext";
export default function LayoutSideBar() {
  const {
    active,
    downMd,
    categoryMenus,
    activeSubMenuItem,
    showMobileSideBar,
    openSecondarySideBar,
    handleSubMenuItem,
    handleActiveMainMenu,
    handleCloseMobileSidebar,
  } = useLayout();
  const { settings } = useContext(SettingsContext);

  const MAIN_SIDEBAR_CONTENT = (
    <Fragment>
      <LogoBox>
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
      </LogoBox>

      <Scrollbar sx={{ maxHeight: "calc(100% - 50px)", pb: 3 }}>
        <div className="navigation-list">
          {navigation.map((nav, index) => (
            <Tooltip title={nav.name} placement="right" key={index}>
              <NavItemButton
                disableRipple
                active={active === nav.name}
                onClick={() => handleActiveMainMenu(nav)}
              >
                {nav.Icon ? <nav.Icon /> : null}
              </NavItemButton>
            </Tooltip>
          ))}
        </div>
      </Scrollbar>
    </Fragment>
  );

  const SECONDARY_SIDEBAR_CONTENT = (
    <Fragment>
      <H6 fontSize={16} color="primary.main" p="1rem 1.2rem">
        {active}
      </H6>

      <Scrollbar sx={{ pb: 3 }}>
        {categoryMenus.map(({ name, path }) => (
          <SubMenuItem
            key={name}
            active={path === activeSubMenuItem}
            onClick={() => handleSubMenuItem(path)}
          >
            <Dot className="dot" />
            <Paragraph fontSize={13} className="title" fontWeight={500}>
              {name}
            </Paragraph>
          </SubMenuItem>
        ))}
      </Scrollbar>
    </Fragment>
  );

  if (downMd) {
    return (
      <MobileSidebarWrapper show={showMobileSideBar}>
        <div className="main-list">{MAIN_SIDEBAR_CONTENT}</div>
        {showMobileSideBar && (
          <div onClick={handleCloseMobileSidebar} className="backdrop" />
        )}
        {categoryMenus.length > 0 && (
          <div className="secondary-list-wrapper">
            <div className="list-inner">{SECONDARY_SIDEBAR_CONTENT}</div>
          </div>
        )}
      </MobileSidebarWrapper>
    );
  }

  return (
    <Fragment>
      <MainMenu>{MAIN_SIDEBAR_CONTENT}</MainMenu>
      <SecondarySideBar show={openSecondarySideBar}>
        {SECONDARY_SIDEBAR_CONTENT}
      </SecondarySideBar>
    </Fragment>
  );
}

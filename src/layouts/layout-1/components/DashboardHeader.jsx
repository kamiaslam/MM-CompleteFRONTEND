import { Fragment, useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import useAuth from "@/hooks/useAuth";
import { SettingsContext } from "@/contexts/settingsContext";
import Menu from "@/icons/Menu";
import MenuLeft from "@/icons/MenuLeft";
import ThemeIcon from "@/icons/ThemeIcon";
import Search from "@/icons/duotone/Search";
import MenuLeftRight from "@/icons/MenuLeftRight";
import useLayout from "@/layouts/layout-1/context/useLayout";
import SearchBar from "@/layouts/layout-parts/SearchBar";
import ProfilePopover from "@/layouts/layout-parts/popovers/ProfilePopover";
import NotificationsPopover from "@/layouts/layout-parts/popovers/NotificationsPopover";
import { DashboardHeaderRoot, StyledToolBar } from "@/layouts/layout-1/styles";

export default function DashboardHeader() {
  const { handleOpenMobileSidebar } = useLayout();
  const { settings, saveSettings } = useContext(SettingsContext);
  const upSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const downMd = useMediaQuery((theme) => theme.breakpoints.down(1200));

  const { user } = useAuth();

  const handleChangeTheme = (value) => {
    saveSettings({ ...settings, theme: value });
  };

  useEffect(() => {
    if (!window.googleTranslateScriptAdded) {
      const googleTranslateScript = document.createElement("script");
      googleTranslateScript.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      googleTranslateScript.type = "text/javascript";
      document.body.appendChild(googleTranslateScript);
      window.googleTranslateScriptAdded = true; // Flag to prevent multiple script loads
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <DashboardHeaderRoot position="sticky">
      <StyledToolBar>
        {/* SMALL DEVICE SIDE BAR OPEN BUTTON */}
        {downMd && (
          <IconButton onClick={handleOpenMobileSidebar}>
            <Menu />
          </IconButton>
        )}

        {/* SEARCH ICON BUTTON */}
        {/* <ClickAwayListener onClickAway={() => setSearchBar(false)}>
          <div>
            {!openSearchBar ? (
              <IconButton onClick={() => setSearchBar(true)}>
                <Search sx={{ color: "grey.400", fontSize: 18 }} />
              </IconButton>
            ) : null}
            <SearchBar
              open={openSearchBar}
              handleClose={() => setSearchBar(false)}
            />
          </div>
        </ClickAwayListener> */}

        <Box flexGrow={1} ml={1} />

        {/* TEXT DIRECTION SWITCH BUTTON */}
        {/* <div
          id="google_translate_element"
          style={{ display: "inline-block", marginLeft: "10px" }}
        ></div> */}
        {/* {settings.direction === "rtl" ? (
          <IconButton onClick={() => handleChangeDirection("ltr")}>
            <MenuLeft sx={{ color: "grey.400" }} />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleChangeDirection("rtl")}>
            <MenuLeftRight sx={{ color: "grey.400" }} />
          </IconButton>
        )} */}

        {/* THEME SWITCH BUTTON */}
        <IconButton
          onClick={() =>
            handleChangeTheme(settings.theme === "light" ? "dark" : "light")
          }
        >
          <ThemeIcon />
        </IconButton>

        {/* Google Translate Dropdown */}

        {upSm &&
          (user?.role === "care_home" || user?.role === "family_member") && (
            <Fragment>
              <NotificationsPopover />
            </Fragment>
          )}

        <ProfilePopover />
      </StyledToolBar>

      {/* Additional styling to hide unwanted Google Translate elements */}
      <style>
        {`
          /* Hide unwanted Google Translate elements */
          .goog-te-banner-frame { display: none !important; }
          body { top: 0px !important; }
          .goog-te-gadget-icon { display: none !important; }
          .goog-te-banner { display: none !important; }
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          .goog-te-menu-value span:first-child { display: none !important; }
          #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
          .goog-te-banner-frame, .goog-te-menu-frame { display: none !important; }
        `}
      </style>
    </DashboardHeaderRoot>
  );
}

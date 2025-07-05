import { useCallback, useEffect, useState, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { navigation } from "./navigation";

export const LayoutContext = createContext({});

export default function LayoutProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const [activeSubMenuItem, setActiveSubMenuItem] = useState("");
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);
  const [openSecondarySideBar, setOpenSecondarySideBar] = useState(false);
  const [categoryMenus, setCategoryMenus] = useState([]);
  const downMd = useMediaQuery((theme) => theme.breakpoints.down(1200));

  const handleCloseMobileSidebar = () => setShowMobileSideBar(false);
  const handleSecondarySideBar = (value) => setOpenSecondarySideBar(value);
  const handleToggleSecondarySideBar = () =>
    setShowMobileSideBar((state) => !state);

  const handleActiveMainMenu = (menuItem) => {
    setActive(menuItem.name);

    if (menuItem.children && menuItem.children.length > 0) {
      setCategoryMenus(menuItem.children);
      const matched = openSecondarySideBar && active === menuItem.name;
      handleSecondarySideBar(!matched);
    } else {
      navigate(menuItem.path);
      setCategoryMenus([]);
      handleCloseMobileSidebar();
      handleSecondarySideBar(false);
    }
  };

  const activeRoute = useCallback(() => {
    navigation.forEach((menu) => {
      const findChild = menu.children?.find((item) => item.path === pathname);
      if (findChild) {
        setActive(menu.name);
        handleSecondarySideBar(true);
        setCategoryMenus(menu.children);
        setActiveSubMenuItem(findChild.path);
      } else if (menu.path === pathname) {
        setActive(menu.name);
        handleSecondarySideBar(false);
      }
    });
  }, [pathname]);

  useEffect(() => {
    activeRoute();
  }, [activeRoute]);

  const handleSubMenuItem = (path) => {
    navigate(path);
    setActiveSubMenuItem(path);
    handleCloseMobileSidebar();
  };

  return (
    <LayoutContext.Provider
      value={{
        active,
        downMd,
        categoryMenus,
        activeSubMenuItem,
        showMobileSideBar,
        openSecondarySideBar,
        handleSubMenuItem,
        handleActiveMainMenu,
        handleSecondarySideBar,
        handleCloseMobileSidebar,
        handleToggleSecondarySideBar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

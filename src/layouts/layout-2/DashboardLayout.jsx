import { Outlet } from "react-router-dom"; // CUSTOM COMPONENTS

import LayoutSideBar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";
import LayoutBodyWrapper from "./components/LayoutBodyWrapper";
import LayoutSetting from "@/layouts/layout-parts/LayoutSetting"; // DASHBOARD LAYOUT BASED CONTEXT PROVIDER

import LayoutProvider from "./context/layoutContext";
import Callmodelmain from "../../components/Callmodelmain";
export default function DashboardLayoutV2({ children }) {
  return (
    <LayoutProvider>
      {/* DASHBOARD SIDEBAR CONTENT */}
      {/* <Callmodelmain /> */}
      <LayoutSideBar />

      <LayoutBodyWrapper>
        {/* DASHBOARD HEADER SECTION */}
        <DashboardHeader />

        {/* MAIN CONTENT RENDER SECTION */}
        {children || <Outlet />}

        {/* LAYOUT SETTING SECTION */}
        {/* <LayoutSetting /> */}
      </LayoutBodyWrapper>
    </LayoutProvider>
  );
}

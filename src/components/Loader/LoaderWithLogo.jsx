// STYLED COMPONENT
import { useContext } from "react";
import { SettingsContext } from "@/contexts/settingsContext";
import { RootStyle } from "./styles";
import "./Loader.css";
export default function LoaderWithLogo() {
  const { settings } = useContext(SettingsContext);

  return (
    <RootStyle
      className={`${settings.theme == "dark" ? "loader-main-dark" : " loader-main-light"} `}
    >
      <div className="loader"></div>
    </RootStyle>
  );
}

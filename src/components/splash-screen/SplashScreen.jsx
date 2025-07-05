import Box from "@mui/material/Box";
import Card from "@mui/material/Card"; // STYLED COMPONENT
import { useContext } from "react";
import { SettingsContext } from "@/contexts/settingsContext";
import { GradientBox, RootStyle } from "./styles";
export default function SplashScreen() {
  const { settings } = useContext(SettingsContext);

  return (
    <RootStyle>
      <GradientBox>
        <Box
          p={4}
          zIndex={1}
          width={100}
          height={100}
          component={Card}
          borderRadius="50%"
          position="relative"
          boxSizing="border-box"
        >
          {settings.theme == "dark" ? (
            <Box
              component="img"
              src="/static/logo/logo-svg.svg"
              alt="essence"
              width="100%"
            />
          ) : (
            <Box
              component="img"
              src="/static/logo/logo-svg-dark.svg"
              alt="essence"
              width="100%"
            />
          )}
        </Box>
      </GradientBox>
    </RootStyle>
  );
}

import React from "react";
import useSettings from "@/hooks/useSettings";
import { ThemeProvider } from "@mui/material/styles";
import { createCustomTheme } from "../theme";

const ProvidersWrapper = ({ children }) => {
  const { settings } = useSettings();
  const theme = createCustomTheme(settings);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ProvidersWrapper;

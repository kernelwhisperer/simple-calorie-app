import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
//
import { FrontPage } from "./pages/FrontPage";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff7f50",
    },
    // secondary: {
    //   main: "#000000",
    // },
  },
});
console.log("📜 LOG > theme", theme);

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default" }}>
        <FrontPage />
      </Box>
    </ThemeProvider>
  );
}

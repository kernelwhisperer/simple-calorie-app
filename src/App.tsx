import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import CssBaseline from "@mui/material/CssBaseline";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import React from "react";
import { SnackbarProvider } from "notistack";
//
import { FrontPage } from "./pages/FrontPage";
import { initFirebase } from "./api/firebase";

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

export function App() {
  initFirebase();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarProvider>
            <FrontPage />
          </SnackbarProvider>
        </LocalizationProvider>
      </Box>
    </ThemeProvider>
  );
}

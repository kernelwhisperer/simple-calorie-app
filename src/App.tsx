import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import CssBaseline from "@mui/material/CssBaseline";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import React from "react";
import { SnackbarProvider } from "notistack";
//
import { AdminPage } from "./pages/AdminPage";
import { FrontPage } from "./pages/FrontPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RequireAuth } from "./context/RequireAuth";
import { UserContextProvider } from "./context/UserContext";
import { WelcomePage } from "./pages/WelcomePage";
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
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <RequireAuth>
                        <FrontPage />
                      </RequireAuth>
                    }
                  />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/welcome" element={<WelcomePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </UserContextProvider>
          </SnackbarProvider>
        </LocalizationProvider>
      </Box>
    </ThemeProvider>
  );
}

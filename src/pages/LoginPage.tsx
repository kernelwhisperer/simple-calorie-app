import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
//
import { initAuth, login } from "../api/firebase-auth";
import { computeInitials } from "../utils";
import { useUserContext } from "../context/UserContext";

export function LoginPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userState, setUserState] = useUserContext();
  const { user } = userState;

  useEffect(() => {
    initAuth((user, profile) => {
      setUserState({ profile, user });
      setLoading(false);
    });
  }, [setLoading, setUserState]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        login();
      }, 1000);
    }
  }, [open]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Simple Calorie App
            </Typography>
            {!loading && !user && (
              <Button color="inherit" onClick={() => setOpen(true)}>
                Login
              </Button>
            )}
            {user && (
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {computeInitials(user.displayName)}
              </Avatar>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Log in or Sign up</DialogTitle>
        <div id="firebaseui-auth-container"></div>
      </Dialog>
    </>
  );
}

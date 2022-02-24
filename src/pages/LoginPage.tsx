import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
//
import {
  initAuth,
  logIn,
  requestSignOut,
  subscribeToAuthChanges,
} from "../api/firebase-auth";
import { computeInitials } from "../utils";
import { useUserContext } from "../context/UserContext";

export function LoginPage() {
  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [userState, setUserState] = useUserContext();
  const subscribing = useRef<boolean>(false);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (subscribing.current) return;
    subscribing.current = true;

    const unsubscribeRef = subscribeToAuthChanges((user, profile) => {
      setUserState({ initialized: true, profile, user });
      if (user) {
        setOpen(false);
        enqueueSnackbar("Signed in", {
          variant: "info",
        });
      }
    });

    return function cleanup() {
      if (unsubscribeRef) unsubscribeRef();
    };
  }, [setUserState, enqueueSnackbar]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        logIn();
      }, 1000);
    }
  }, [open]);

  const handleSignout = useCallback(async () => {
    try {
      await requestSignOut();
      enqueueSnackbar("Signed out", {
        variant: "info",
      });
      setUserState({ initialized: true });
    } catch (err) {
      if (err instanceof TypeError) {
        enqueueSnackbar(err.toString(), {
          variant: "error",
        });
      }
    }
  }, [enqueueSnackbar, setUserState]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              component={Link}
              variant="h6"
              to="/"
              sx={{ flexGrow: 1, textDecoration: "none" }}
              color="primary"
            >
              Simple Calorie App
            </Typography>
            {userState.initialized && !userState.user && (
              <Button color="inherit" onClick={() => setOpen(true)}>
                Login
              </Button>
            )}
            {userState.user && (
              <Stack direction="row" spacing={2}>
                <Button color="inherit" onClick={handleSignout}>
                  Sign out
                </Button>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {computeInitials(userState.user.displayName)}
                </Avatar>
              </Stack>
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

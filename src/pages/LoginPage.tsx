import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  Fade,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Spring, animated } from "react-spring";
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
      <Spring
        config={{
          friction: 50,
          tension: 210,
          velocity: 0.033,
        }}
        delay={200}
        from={{
          opacity: 0,
          transform: "translate3d(0,-80px,1px)",
        }}
        to={{
          opacity: 1,
          transform: "translate3d(0,0px,1px)",
        }}
      >
        {(styles) => (
          <animated.div style={styles}>
            <AppBar position="sticky">
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
                <Fade
                  in={userState.initialized && !userState.user}
                  unmountOnExit
                  timeout={{ exit: 0 }}
                >
                  <Button color="inherit" onClick={() => setOpen(true)}>
                    Login
                  </Button>
                </Fade>
                <Fade in={!!userState.user} unmountOnExit timeout={{ exit: 0 }}>
                  <Stack direction="row" spacing={2}>
                    <Button color="inherit" onClick={handleSignout}>
                      Sign out
                    </Button>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {computeInitials(userState.user?.displayName)}
                    </Avatar>
                  </Stack>
                </Fade>
              </Toolbar>
            </AppBar>
          </animated.div>
        )}
      </Spring>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Log in or Sign up</DialogTitle>
        <div id="firebaseui-auth-container"></div>
      </Dialog>
    </>
  );
}

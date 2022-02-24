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
import { Link, useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/system";
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
  const navigate = useNavigate();
  const [userState, setUserState] = useUserContext();
  const { user } = userState;

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    subscribeToAuthChanges((user, profile) => {
      setUserState({ profile, user });
      setOpen(false);
      navigate("/", { replace: true });
      enqueueSnackbar("Signed in", {
        variant: "info",
      });
    });
  }, [navigate, setUserState, enqueueSnackbar, setOpen]);

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
      setUserState({});
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
            {!user && (
              <Button color="inherit" onClick={() => setOpen(true)}>
                Login
              </Button>
            )}
            {user && (
              <Stack direction="row" spacing={2}>
                <Button color="inherit" onClick={handleSignout}>
                  Sign out
                </Button>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {computeInitials(user.displayName)}
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

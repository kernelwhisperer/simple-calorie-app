import React, { useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
//
import { useUserContext } from "../context/UserContext";

const HOMEPAGES = {
  admin: "/admin",
  user: "/",
};

export function WelcomePage() {
  const navigate = useNavigate();
  const [userState] = useUserContext();

  useEffect(() => {
    if (userState.user && userState.profile) {
      navigate(HOMEPAGES[userState.profile.role], { replace: true });
    }
  }, [userState, navigate]);

  return (
    <Stack alignItems="center" sx={{ m: 4 }}>
      <Typography variant="h6">Welcome!</Typography>
      <Typography color="text.secondary">
        Log in or sign up to get started.
      </Typography>
    </Stack>
  );
}

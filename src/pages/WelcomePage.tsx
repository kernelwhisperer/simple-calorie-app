import { Stack, Typography } from "@mui/material";
import React from "react";

export function WelcomePage(props) {
  return (
    <Stack alignItems="center" sx={{ m: 4 }}>
      <Typography variant="h6">Welcome!</Typography>
      <Typography color="text.secondary">
        Log in or sign up to get started.
      </Typography>
    </Stack>
  );
}

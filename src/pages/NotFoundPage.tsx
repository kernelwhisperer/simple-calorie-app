import { Stack, Typography } from "@mui/material";
import React from "react";

export function NotFoundPage() {
  return (
    <Stack alignItems="center" sx={{ m: 4 }}>
      <Typography variant="h6" color="text.secondary">
        404: Not found
      </Typography>
    </Stack>
  );
}

"use client";

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useLogout, useMe } from "../lib/query/auth";

export default function DashboardPage() {
  const router = useRouter();
  const me = useMe();
  const logout = useLogout();

  if (me.isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (me.isError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <Typography>Please log in to continue.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 480, mx: "auto", pt: 8, px: 2 }}>
      <Typography variant="h5" component="h1">
        Welcome back, {me.data.email}
      </Typography>
      <Button
        variant="outlined"
        sx={{ alignSelf: "flex-start" }}
        disabled={logout.isPending}
        onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
      >
        Log out
      </Button>
    </Stack>
  );
}

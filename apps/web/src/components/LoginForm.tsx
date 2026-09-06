"use client";

import { loginSchema, type LoginInput } from "@lexi/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "../lib/errors";
import { useLogin } from "../lib/query/auth";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: () => router.push("/"),
    });
  });

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} sx={{ width: "100%", maxWidth: 360 }} noValidate>
      <Typography variant="h5" component="h1">
        Log in
      </Typography>

      {loginMutation.isError && <Alert severity="error">{getErrorMessage(loginMutation.error)}</Alert>}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email")}
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" variant="contained" disabled={isSubmitting || loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in…" : "Log in"}
      </Button>
    </Stack>
  );
}

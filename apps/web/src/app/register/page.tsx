"use client";

import { registerSchema, type RegisterInput } from "@lexi/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "../../lib/errors";
import { useRegister } from "../../lib/query/auth";

export function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(values, {
      onSuccess: () => router.push("/"),
    });
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 8, px: 2 }}>
      <Stack component="form" onSubmit={onSubmit} spacing={2} sx={{ width: "100%", maxWidth: 360 }} noValidate>
        <Typography variant="h5" component="h1">
          Create your account
        </Typography>

        {registerMutation.isError && <Alert severity="error">{getErrorMessage(registerMutation.error)}</Alert>}

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
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" variant="contained" disabled={isSubmitting || registerMutation.isPending}>
          {registerMutation.isPending ? "Creating account…" : "Create account"}
        </Button>
      </Stack>
    </Box>
  );
}

export default RegisterPage;

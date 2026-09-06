import { Box } from "@mui/material";
import { RegisterForm } from "../../components/register-form";

export default function RegisterPage() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 8, px: 2 }}>
      <RegisterForm />
    </Box>
  );
}

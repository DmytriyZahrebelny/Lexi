import { Box } from "@mui/material";
import { LoginForm } from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 8, px: 2 }}>
      <LoginForm />
    </Box>
  );
}

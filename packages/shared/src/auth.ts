import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema;
export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

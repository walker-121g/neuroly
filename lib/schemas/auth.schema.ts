import { z } from "zod";

const passwordField = z
  .string()
  .min(6)
  .refine(
    (password) =>
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(password),
    "The password must contain at least one number, one uppercase letter, one lowercase letter, and one special character.",
  );

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: passwordField,
    secondaryPassword: z.string(),
  })
  .refine(
    (object) => object.password === object.secondaryPassword,
    "Your passwords do not match.",
  );

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordField,
  rememberMe: z.boolean(),
});

export const refreshSchema = z.object({
  id: z.number(),
  refreshToken: z.string(),
});

export const logoutSchema = z.object({
  id: z.number(),
  refreshToken: z.string(),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RefreshSchema = z.infer<typeof refreshSchema>;
export type LogoutSchema = z.infer<typeof logoutSchema>;

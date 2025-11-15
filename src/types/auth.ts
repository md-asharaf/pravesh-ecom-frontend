import { z } from "zod";

export const loginSchema = z.object({
  phoneOrEmail: z.string(),
  password: z.string().optional(),
});

export const verifyOtpSchema = z.object({
  phoneOrEmail: z.string(),
  otp: z.string(),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().nonempty("Phone is required").min(10).max(10),
  password: z.string().nonempty("Password is required").min(6),
  image: z.string().optional(),
});

export type Login = z.infer<typeof loginSchema>;
export type VerifyOtp = z.infer<typeof verifyOtpSchema>;
export type Register = z.infer<typeof registerSchema>;
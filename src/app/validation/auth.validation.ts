import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email("Invalid email address")
    .min(1, "Email is required"),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .trim()
    .min(1, "Name is required"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be string",
    })
    .trim()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/gm,
      "Password must be 8+ chars with uppercase, lowercase, number & symbol."
    ),
});

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Username / Email is required" })
    .trim()
    .min(1, "Username / Email is required"),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(1, "Password is required"),
});

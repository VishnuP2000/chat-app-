import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(20, "Name must be at most 20 characters long"),

    email: z
      .string()
      .email("Invalid email format")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"), // additional validation

    password: z
      .string()
      .min(8, "Password must be at least 8 digits long")
      .regex(/^\d+$/, "Password must contain only numbers"), // only numbers allowed

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 digits long")
    .regex(/^\d+$/, "Password must contain only numbers"),

  email: z
    .string()
    .email("Invalid email format")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
});

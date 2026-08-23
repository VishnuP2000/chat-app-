"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
console.log("zod validations");
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(20, "Name must be at most 20 characters long"),
    email: zod_1.z
        .string()
        .email("Invalid email format")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"), // additional validation
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 digits long")
        .regex(/^\d+$/, "Password must contain only numbers"), // only numbers allowed
    confirmPassword: zod_1.z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.signInSchema = zod_1.z.object({
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 digits long")
        .regex(/^\d+$/, "Password must contain only numbers"),
    email: zod_1.z
        .string()
        .email("Invalid email format")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
});

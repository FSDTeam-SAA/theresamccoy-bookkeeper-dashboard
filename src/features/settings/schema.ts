import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "./constants";

const PHONE_CHARS = /^\+?[\d\s().-]+$/;

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Enter your first name.")
    .max(60, "First name must be 60 characters or fewer."),
  lastName: z
    .string()
    .trim()
    .min(1, "Enter your last name.")
    .max(60, "Last name must be 60 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "Email must be 254 characters or fewer.")
    .pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .min(1, "Enter your phone number.")
    .max(25, "Phone number must be 25 characters or fewer.")
    .refine(
      (value) =>
        PHONE_CHARS.test(value) && value.replace(/\D/g, "").length >= 7,
      "Enter a valid phone number.",
    ),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Enter your current password.")
      .max(1024),
    newPassword: z
      .string()
      .max(1024)
      .min(
        PASSWORD_MIN_LENGTH,
        `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
      )
      .regex(/[a-z]/, "Include a lowercase letter.")
      .regex(/[A-Z]/, "Include an uppercase letter.")
      .regex(/\d/, "Include a number."),
    confirmPassword: z.string().min(1, "Confirm your new password.").max(1024),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "Choose a password different from your current one.",
  });

export type PasswordValues = z.infer<typeof passwordSchema>;

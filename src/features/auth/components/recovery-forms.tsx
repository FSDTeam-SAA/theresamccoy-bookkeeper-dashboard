"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AuthField, AuthHeading, FormErrors, FormNotice } from "./auth-fields";
import styles from "../auth.module.css";
import {
  errorMessage,
  readRecoveryState,
  requestPasswordReset,
  resetPassword,
  writeRecoveryState,
} from "../api/auth.api";

const emailSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
});
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Use at least 6 characters for your password.")
      .max(1024),
    confirmPassword: z.string().min(1, "Confirm your new password.").max(1024),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export function ForgotPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  async function submit({ email }: z.infer<typeof emailSchema>) {
    setMessage("");
    try {
      await requestPasswordReset(email);
      writeRecoveryState({ email });
      router.push("/verify-email");
    } catch (error) {
      setMessage(errorMessage(error));
    }
  }

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={handleSubmit(submit)}
      aria-busy={isSubmitting}
    >
      <AuthHeading title="Forgot Password">
        Enter your email to recover your password
      </AuthHeading>
      <AuthField
        id="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        placeholder="hello@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormNotice message={message} />
      <Button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send OTP"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, submitCount, isSubmitting },
  } = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    shouldFocusError: false,
  });

  async function submit({ password }: z.infer<typeof passwordSchema>) {
    setMessage("");
    const state = readRecoveryState();
    if (!state?.resetToken) {
      setMessage(
        "Your reset session has expired. Request a new code from Forgot Password.",
      );
      return;
    }
    try {
      await resetPassword({
        email: state.email,
        resetToken: state.resetToken,
        newPassword: password,
      });
      writeRecoveryState(null);
      router.push("/password-changed");
    } catch (error) {
      setMessage(errorMessage(error));
    }
  }

  return (
    <>
      <FormErrors errors={errors} submitCount={submitCount} />
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(submit)}
        aria-busy={isSubmitting}
      >
        <AuthHeading title="Change Password">
          Choose a new password for your account
        </AuthHeading>
        <div className={styles.fields}>
          <AuthField
            id="password"
            label="Create New Password"
            type="password"
            autoComplete="new-password"
            placeholder="********"
            error={errors.password?.message}
            {...register("password")}
          />
          <AuthField
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            placeholder="********"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
        <FormNotice message={message} />
        <Button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Change Password"}
        </Button>
      </form>
    </>
  );
}

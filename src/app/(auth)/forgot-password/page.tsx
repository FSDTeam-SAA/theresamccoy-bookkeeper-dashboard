import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/recovery-forms";

export const metadata: Metadata = {
  title: "Forgot Password | Bookkeeper Dashboard",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

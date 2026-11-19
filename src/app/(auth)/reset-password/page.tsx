import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/recovery-forms";

export const metadata: Metadata = {
  title: "Change Password | Bookkeeper Dashboard",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}

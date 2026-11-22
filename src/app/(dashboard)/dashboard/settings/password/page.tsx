import type { Metadata } from "next";
import { PasswordForm } from "@/features/settings/components/password-form";

export const metadata: Metadata = {
  title: "Password Settings | Bookkeeper Dashboard",
};

export default function SettingsPasswordPage() {
  return <PasswordForm />;
}

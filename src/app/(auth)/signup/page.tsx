import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | Bookkeeper Dashboard",
};

export default function SignupPage() {
  return <SignupForm />;
}

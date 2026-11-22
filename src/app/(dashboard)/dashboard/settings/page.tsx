import type { Metadata } from "next";
import { PersonalInfoForm } from "@/features/settings/components/personal-info-form";

export const metadata: Metadata = {
  title: "Profile Settings | Bookkeeper Dashboard",
};

export default function SettingsProfilePage() {
  return <PersonalInfoForm />;
}

import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ProfileEdit } from "@/features/profile/components/profile-edit";
import { PROFILE_HEADER } from "@/features/profile/constants";

export const metadata: Metadata = { title: "Edit Profile & Skills | Bookkeeper Dashboard" };

export default function ProfileEditPage() {
  return (
    <>
      <DashboardHeader
        title={PROFILE_HEADER.title}
        subtitle={PROFILE_HEADER.subtitle}
      />
      <main className="flex min-w-0 flex-col gap-4 p-4 sm:p-6">
        <ProfileEdit />
      </main>
    </>
  );
}

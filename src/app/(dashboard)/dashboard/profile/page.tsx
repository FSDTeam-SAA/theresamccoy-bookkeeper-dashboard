import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ProfileView } from "@/features/profile/components/profile-view";
import { PROFILE_HEADER } from "@/features/profile/constants";

export const metadata: Metadata = { title: "Profile & Skills | Bookkeeper Dashboard" };

export default function ProfilePage() {
  return (
    <>
      <DashboardHeader
        title={PROFILE_HEADER.title}
        subtitle={PROFILE_HEADER.subtitle}
      />
      <main className="flex min-w-0 flex-col gap-6 p-4 sm:p-6">
        <ProfileView />
      </main>
    </>
  );
}

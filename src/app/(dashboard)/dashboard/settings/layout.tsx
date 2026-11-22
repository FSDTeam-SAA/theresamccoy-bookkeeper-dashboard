import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ProfileCard } from "@/features/settings/components/profile-card";
import { SettingsTabs } from "@/features/settings/components/settings-tabs";
import {
  SETTINGS_SUBTITLE,
  SETTINGS_TITLE,
} from "@/features/settings/constants";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader title={SETTINGS_TITLE} subtitle={SETTINGS_SUBTITLE} />
      <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6">
        <SettingsTabs />
        <ProfileCard />
        {children}
      </div>
    </>
  );
}

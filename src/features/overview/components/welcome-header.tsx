"use client";

import { useSession } from "next-auth/react";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export function WelcomeHeader() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.trim().split(/\s+/)[0];

  return (
    <DashboardHeader
      title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
      subtitle="Here's an overview of your marketplace profile and activity."
    />
  );
}

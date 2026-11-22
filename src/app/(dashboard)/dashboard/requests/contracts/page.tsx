import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ContractRequests } from "@/features/interviews/components/contract-requests";
import { REQUESTS_SUBTITLE } from "@/features/interviews/constants";

export const metadata: Metadata = {
  title: "Contract Signing | Bookkeeper Dashboard",
};

export default function ContractSigningPage() {
  return (
    <>
      <DashboardHeader title="Contract Signing" subtitle={REQUESTS_SUBTITLE} />
      <ContractRequests />
    </>
  );
}

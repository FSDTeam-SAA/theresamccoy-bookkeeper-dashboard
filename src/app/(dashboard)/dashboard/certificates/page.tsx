import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CertificatesList } from "@/features/certificates/components/certificates-list";
import {
  CERTIFICATES_SUBTITLE,
  CERTIFICATES_TITLE,
} from "@/features/certificates/constants";

export const metadata: Metadata = {
  title: "Certificates | Bookkeeper Dashboard",
};

export default function CertificatesPage() {
  return (
    <>
      <DashboardHeader
        title={CERTIFICATES_TITLE}
        subtitle={CERTIFICATES_SUBTITLE}
      />
      <CertificatesList />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CertificateViewer } from "@/features/certificates/components/certificate-viewer";
import {
  CERTIFICATES,
  CERTIFICATES_SUBTITLE,
  CERTIFICATES_TITLE,
  findCertificate,
} from "@/features/certificates/constants";

type Params = { id: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return CERTIFICATES.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const certificate = findCertificate(id);
  return {
    title: `${certificate?.course ?? "Certificate"} | Bookkeeper Dashboard`,
  };
}

export default async function CertificateRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const certificate = findCertificate(id);
  if (!certificate) notFound();

  return (
    <>
      <DashboardHeader
        title={CERTIFICATES_TITLE}
        subtitle={CERTIFICATES_SUBTITLE}
      />
      <CertificateViewer certificate={certificate} />
    </>
  );
}

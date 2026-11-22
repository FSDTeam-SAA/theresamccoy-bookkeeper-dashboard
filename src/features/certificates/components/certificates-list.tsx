import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CERTIFICATES, CERTIFICATE_ICONS, certificateHref } from "../constants";
import type { Certificate } from "../types";
import { DownloadPdfButton } from "./download-pdf-button";

const divider = "sm:border-r-[0.5px] sm:border-[#787878]";

function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-center gap-1", className)}>
      <dt className="text-[12px] leading-[1.5] text-[#6a6a6a] uppercase">
        {label}
      </dt>
      <dd className="text-[18px] leading-[1.5] text-ink">{value}</dd>
    </div>
  );
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const titleId = `certificate-${certificate.id}-title`;

  return (
    <li
      aria-labelledby={titleId}
      className="flex flex-col gap-4 rounded-[8px] bg-white p-4 drop-shadow-[4px_4px_4px_rgba(0,0,0,0.1)] sm:pr-6 sm:pl-8 min-[1760px]:min-h-[142px] min-[1760px]:flex-row min-[1760px]:items-stretch min-[1760px]:gap-2"
    >
      <dl className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-y-4 min-[1760px]:flex-nowrap">
        <div
          className={cn(
            "col-span-2 flex flex-col justify-center gap-4 sm:w-[315px] sm:pr-5",
            divider,
          )}
        >
          <div className="flex flex-col gap-1 leading-[1.5]">
            <dt className="text-[12px] text-[#6a6a6a] uppercase">
              {certificate.kind}
            </dt>
            <dd id={titleId} className="text-[18px] text-ink">
              {certificate.course}
            </dd>
          </div>
          <p className="text-[16px] leading-[1.2] text-[#6a6a6a]">
            Awarded to {certificate.awardedTo}
          </p>
        </div>
        <Detail
          label="Completion Date"
          value={certificate.completionDate}
          className={cn("sm:w-[185px] sm:px-5", divider)}
        />
        <Detail
          label="Lessons"
          value={String(certificate.lessons)}
          className={cn("sm:w-[190px] sm:px-5", divider)}
        />
        <Detail
          label="Instructor"
          value={certificate.instructor}
          className="sm:w-[144px] sm:px-5"
        />
      </dl>

      <div className="flex min-w-0 flex-1 flex-col gap-4 min-[1760px]:items-end min-[1760px]:justify-end min-[1760px]:gap-6">
        <p className="text-[16px] leading-[1.2] font-light text-[#6a6a6a] min-[1760px]:flex-1 min-[1760px]:text-right">
          {certificate.duration}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row min-[1760px]:justify-end">
          <Button
            asChild
            variant="brand"
            className="h-11 gap-[10px] rounded-[8px] px-8 text-[16px] leading-[1.2] font-normal text-white sm:w-[211px]"
          >
            <Link
              href={certificateHref(certificate.id)}
              aria-label={`View certificate for ${certificate.course}`}
            >
              <Image
                src={CERTIFICATE_ICONS.badge}
                width={16}
                height={16}
                alt=""
              />
              View Certificate
            </Link>
          </Button>
          <DownloadPdfButton
            variant="brand-outline"
            course={certificate.course}
            className="sm:w-[211px]"
          />
        </div>
      </div>
    </li>
  );
}

/** Certificates list (Figma 11380:12577). */
export function CertificatesList() {
  return (
    <div className="px-4 py-5 sm:px-10 sm:py-[38px]">
      <ul className="flex flex-col gap-5" aria-label="Earned certificates">
        {CERTIFICATES.map((certificate) => (
          <CertificateCard key={certificate.id} certificate={certificate} />
        ))}
      </ul>
    </div>
  );
}

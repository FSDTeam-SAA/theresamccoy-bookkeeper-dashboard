import Image from "next/image";
import Link from "next/link";
import { MaskIcon } from "@/components/layout/mask-icon";
import { Button } from "@/components/ui/button";
import { CERTIFICATES_HREF, CERTIFICATE_ICONS } from "../constants";
import type { Certificate } from "../types";
import { DownloadPdfButton } from "./download-pdf-button";

/**
 * Certificate viewer (Figma 11380:12712). Figma only has a grey placeholder
 * for the document, so the preview is composed from the certificate data at
 * the same 1134×624 proportions until real certificate artwork exists.
 */
export function CertificateViewer({
  certificate,
}: {
  certificate: Certificate;
}) {
  return (
    <div className="flex justify-center px-4 py-6 sm:px-10 sm:py-[75px]">
      <div className="flex w-full max-w-[1134px] flex-col items-center gap-10">
        <figure
          aria-label={`${certificate.kind}: ${certificate.course}`}
          className="flex min-h-[320px] w-full sm:aspect-[1134/624] sm:min-h-0 flex-col items-center justify-center gap-[3%] border-[6px] border-double border-brand-800 bg-white p-[4%] text-center"
        >
          {/* Same crop as BrandLogo, without its dashboard link. */}
          <span className="relative h-[clamp(44px,8vw,88px)] w-[clamp(50px,9vw,100px)] shrink-0 overflow-hidden">
            <span className="absolute top-[-25.33%] left-[-16.13%] h-[149.11%] w-[131.31%]">
              <Image
                src="/images/dashboard/logo.png"
                alt="Bookkeepers Marketplace"
                fill
                sizes="132px"
                className="object-fill"
              />
            </span>
          </span>
          <p className="text-[clamp(10px,1.6vw,16px)] tracking-[0.2em] text-muted-text uppercase">
            {certificate.kind}
          </p>
          <p className="text-[clamp(12px,1.4vw,16px)] font-light text-[#6a6a6a]">
            This certifies that
          </p>
          <p className="text-[clamp(20px,3.4vw,40px)] leading-[1.2] font-medium text-brand-900">
            {certificate.awardedTo}
          </p>
          <p className="text-[clamp(12px,1.4vw,16px)] font-light text-[#6a6a6a]">
            has completed
          </p>
          <p className="text-[clamp(16px,2.2vw,26px)] leading-[1.2] font-semibold text-ink">
            {certificate.course}
          </p>
          <figcaption className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[clamp(11px,1.3vw,14px)] text-[#6a6a6a]">
            <span>{certificate.completionDate}</span>
            <span>{certificate.lessons} lessons</span>
            <span>Instructor: {certificate.instructor}</span>
          </figcaption>
        </figure>

        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
          <Button
            asChild
            className="h-11 gap-[10px] rounded-[8px] bg-[#e9e9e9] px-8 font-onest text-[16px] leading-[1.2] font-normal text-muted-text hover:bg-[#dedede] focus-visible:ring-brand-400/40 sm:w-[211px]"
          >
            <Link href={CERTIFICATES_HREF}>
              <MaskIcon
                src={CERTIFICATE_ICONS.arrowBrand}
                size={22}
                className="-rotate-90"
              />
              Go Back
            </Link>
          </Button>
          <DownloadPdfButton
            variant="brand"
            course={certificate.course}
            className="sm:w-[211px]"
          />
        </div>
      </div>
    </div>
  );
}

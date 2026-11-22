"use client";

import { toast } from "sonner";
import { MaskIcon } from "@/components/layout/mask-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CERTIFICATE_ICONS, PDF_COMING_SOON } from "../constants";

/** "Download PDF" with a down arrow; no PDF backend yet, so it toasts. */
export function DownloadPdfButton({
  variant,
  course,
  className,
}: {
  variant: "brand" | "brand-outline";
  course: string;
  className?: string;
}) {
  const outline = variant === "brand-outline";
  return (
    <Button
      type="button"
      variant={variant}
      aria-label={`Download PDF certificate for ${course}`}
      onClick={() => toast.info(PDF_COMING_SOON)}
      className={cn(
        "h-11 gap-[10px] rounded-[8px] px-8 text-[16px] leading-[1.2] font-normal",
        outline ? "bg-white" : "text-white",
        className,
      )}
    >
      {outline ? "Download PDF" : null}
      <MaskIcon
        src={CERTIFICATE_ICONS.arrowBrand}
        size={22}
        className="rotate-180"
      />
      {outline ? null : "Download PDF"}
    </Button>
  );
}

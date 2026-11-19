import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "../constants";
import type { ApplicationStatus } from "../types";

export function StatusPill({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-[120px] items-center justify-center rounded-[4px] p-2 font-onest text-[14px] leading-[1.2] font-medium whitespace-nowrap",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

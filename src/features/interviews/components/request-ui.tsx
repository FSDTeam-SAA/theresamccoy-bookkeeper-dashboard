"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { MaskIcon } from "@/components/layout/mask-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  COMING_SOON,
  CONTRACTS_HREF,
  ICONS,
  MAX_UPLOAD_BYTES,
  REQUESTS_HREF,
} from "../constants";
import type { BusinessRequest, DetailRow } from "../types";

export const notifyComingSoon = (feature: string) =>
  toast.info(`${feature} is coming soon`, { description: COMING_SOON });

/** Returns an error message, or null when the file is acceptable. */
export function validateUpload(file: File, accept: string) {
  const allowed = accept.split(",").map((ext) => ext.trim().toLowerCase());
  const name = file.name.toLowerCase();
  if (!allowed.some((ext) => name.endsWith(ext))) {
    return `Unsupported file type. Use ${allowed.join(", ").toUpperCase()}.`;
  }
  if (file.size > MAX_UPLOAD_BYTES) return "File is larger than 10 MB.";
  return null;
}

/* ---------- tabs (Figma 11716:13628) ---------- */

type TabKey = "interview" | "contracts";

const tabBase =
  "inline-flex h-10 min-w-[136px] flex-1 items-center justify-center rounded-[4px] px-3 text-[14px] leading-[1.2] transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/40 sm:flex-none";
const tabActive =
  "bg-brand-800 font-medium text-brand-50 drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]";
const tabIdle =
  "bg-muted-text/10 font-light text-muted-text shadow-[inset_0px_4px_4px_0px_rgba(153,153,153,0.1)] hover:bg-muted-text/15 hover:text-brand-900";

export function RequestsTabs({ active }: { active: TabKey }) {
  const tabs = [
    { key: "interview", label: "Interview", href: REQUESTS_HREF },
    { key: "contracts", label: "Contract Signing", href: CONTRACTS_HREF },
  ] as const;

  return (
    <nav aria-label="Request types" className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? "page" : undefined}
          className={cn(tabBase, tab.key === active ? tabActive : tabIdle)}
        >
          {tab.label}
        </Link>
      ))}
      {/* No Meeting Link design yet — keep the tab visible but inert. */}
      <button
        type="button"
        aria-disabled="true"
        onClick={() => notifyComingSoon("Meeting links")}
        className={cn(tabBase, tabIdle, "cursor-not-allowed")}
      >
        Meeting Link
      </button>
    </nav>
  );
}

/* ---------- badges ---------- */

/** Pending-count badge next to a section heading (Figma "Bdg"). */
export function CountBadge({ count, label }: { count: number; label: string }) {
  return (
    <span
      aria-label={`${count} ${label}`}
      className="inline-flex h-[29px] min-w-[29px] items-center justify-center rounded-full bg-[#ffeeb8] px-3 text-[18px] leading-[1.2] text-[#9a3412]"
    >
      {count}
    </span>
  );
}

const statusBadgeTones = {
  success: "bg-[#e8f0eb] text-[#166534]",
  warning: "bg-[#f9ece7] text-[#9a3412]",
  neutral: "bg-[#e7eaea] text-[#4b5b5e]",
  danger: "bg-[#fdecec] text-[#b91c1c]",
} as const;

export type StatusBadgeTone = keyof typeof statusBadgeTones;

export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: StatusBadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px] leading-[1.2] font-light whitespace-nowrap",
        statusBadgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- key/value rows ---------- */

export function DetailRows({ rows }: { rows: DetailRow[] }) {
  return (
    <dl className="flex flex-col">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b border-[#f2f2f2] py-3 text-[16px] leading-[1.2] first:pt-0 last:border-b-0 last:pb-0 sm:text-[18px]"
        >
          <dt className="text-[#6a6a6a]">{row.label}</dt>
          <dd className="text-right text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- request card (Figma 11574:13008) ---------- */

export function RequestCard({
  request,
  actions,
}: {
  request: BusinessRequest;
  actions: React.ReactNode;
}) {
  const titleId = `request-${request.id}`;
  return (
    <li
      aria-labelledby={titleId}
      className="flex flex-col gap-6 rounded-[12px] bg-white p-4 sm:p-5 md:flex-row md:items-center md:gap-[120px]"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex items-center gap-2 py-3">
          <Image
            src={ICONS.avatar}
            width={40}
            height={40}
            alt=""
            className="shrink-0"
          />
          <div className="flex min-w-0 flex-col gap-1 text-[14px] leading-[1.2]">
            <h3 id={titleId} className="font-medium text-ink-400">
              {request.company}
            </h3>
            <p className="font-light text-[#6a6a6a]">{request.received}</p>
          </div>
        </div>
        <DetailRows
          rows={[
            { label: "Project", value: request.project },
            { label: "Value", value: request.value },
            { label: "Deadline", value: request.deadline },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row md:w-[156px] md:flex-col">
        {actions}
      </div>
    </li>
  );
}

export const primaryAction =
  "h-auto min-h-11 w-full rounded-[8px] px-6 py-3 text-[14px] leading-[1.2] font-light";
export const dangerOutline =
  "border border-[#dc2626] bg-white text-[#dc2626] hover:bg-[#fef2f2] focus-visible:ring-[#dc2626]/30";

/* ---------- confirmation dialog ---------- */

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-onest sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-medium text-ink">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[14px] text-[#6a6a6a]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="brand-outline" className="h-11 rounded-[8px] px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="outline"
            onClick={onConfirm}
            className={cn("h-11 rounded-[8px] px-6 shadow-none", dangerOutline)}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Small "Back to …" link shown above detail content. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-1 rounded text-[14px] leading-[1.2] text-muted-text hover:text-brand-900 focus-visible:ring-[3px] focus-visible:ring-brand-400/40 focus-visible:outline-none"
    >
      <MaskIcon
        src="/images/dashboard/arrow-up-line.svg"
        size={18}
        className="-rotate-90"
      />
      {label}
    </Link>
  );
}

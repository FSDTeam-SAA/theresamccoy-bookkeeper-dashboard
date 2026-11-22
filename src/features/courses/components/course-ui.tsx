"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { COMING_SOON } from "../constants";

/* ---------- status pills ---------- */

const pillTones = {
  info: "bg-[rgba(0,149,255,0.16)] text-[#004d83]",
  success: "bg-[rgba(0,255,47,0.11)] text-[#00832c]",
  onDark: "bg-white/16 text-mist-50",
} as const;

/** Small 12px semibold pill (Figma: "72% Complete", "In Progress", "Completed"). */
export function Pill({
  tone,
  children,
  className,
}: {
  tone: keyof typeof pillTones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-[12px] leading-[1.2] font-semibold whitespace-nowrap",
        pillTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusTones = {
  completed: "bg-[rgba(0,212,88,0.18)] text-[#006316]",
  "in-progress": "bg-[rgba(0,117,212,0.18)] text-[#005fad]",
  current: "bg-white text-[#374151]",
  pending: "bg-[rgba(212,170,0,0.12)] text-[#935c00]",
} as const;

export type StatusTone = keyof typeof statusTones;

/** 16px medium status pill used on module, lesson and assignment rows. */
export function StatusPill({
  tone,
  children,
}: {
  tone: StatusTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[14px] leading-[1.2] font-medium whitespace-nowrap sm:px-4 sm:py-2 sm:text-[16px]",
        statusTones[tone],
      )}
    >
      {children}
    </span>
  );
}

const chipTones = {
  neutral: "bg-[rgba(95,114,117,0.1)] text-muted-text",
  info: "bg-[rgba(59,130,246,0.1)] text-[#2563eb]",
} as const;

/** Compact 12px chip in the course summary (Figma: "Intermediate", "72% Complete"). */
export function Chip({
  tone,
  children,
}: {
  tone: keyof typeof chipTones;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px] leading-[1.2] font-medium whitespace-nowrap",
        chipTones[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ---------- progress bar ---------- */

export function ProgressBar({
  value,
  label,
  valueText,
  size = "md",
  trackClassName,
  fillClassName,
}: {
  value: number;
  label: string;
  valueText?: string;
  size?: "sm" | "md";
  trackClassName?: string;
  fillClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-valuetext={valueText}
      className={cn(
        "w-full overflow-hidden rounded-full bg-brand-900/8",
        size === "sm" ? "h-1.5" : "h-2.5",
        trackClassName,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-brand-800 transition-[width] duration-500 motion-reduce:transition-none",
          fillClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* ---------- placeholders for actions without a backend ---------- */

export const notifyComingSoon = (feature: string) =>
  toast.info(`${feature} is coming soon`, { description: COMING_SOON });

/** Shared card surface used across the course screens. */
export const cardSurface = "rounded-[12px] bg-white";

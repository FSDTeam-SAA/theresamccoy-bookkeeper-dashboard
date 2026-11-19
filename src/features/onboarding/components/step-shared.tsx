"use client";

import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "../store";
import type { ApplyDraft } from "../schema";

export type StepProps = {
  onNext: () => void;
  onBack?: () => void;
};

/** Mirrors every edit into the persisted draft so refresh/Back keep values. */
export function useDraftSync<K extends keyof ApplyDraft>(
  form: UseFormReturn<ApplyDraft[K] & FieldValues>,
  key: K,
) {
  const saveStep = useOnboardingStore((s) => s.saveStep);
  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) =>
          saveStep(key, JSON.parse(JSON.stringify(values)) as ApplyDraft[K]),
      }),
    [form, key, saveStep],
  );
}

export function StepActions({
  onBack,
  submitLabel = "Next",
  submitting,
}: {
  onBack?: () => void;
  submitLabel?: string;
  submitting?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-start",
        onBack ? "sm:justify-between" : "sm:justify-start",
      )}
    >
      {onBack && (
        <Button
          type="button"
          variant="brand-muted"
          onClick={onBack}
          className="h-[42px] w-full bg-[#e2e2e2] p-4 text-base font-semibold text-[#091718] sm:w-44"
        >
          Back
        </Button>
      )}
      <Button
        type="submit"
        variant="brand"
        disabled={submitting}
        className={cn(
          "h-[42px] w-full p-4 text-base font-semibold",
          submitLabel === "Next" ? "sm:w-[197px]" : "sm:w-[335px]",
        )}
      >
        {submitLabel}
      </Button>
    </div>
  );
}

export const formClass = "flex w-full flex-col gap-8";
export const gridClass =
  "grid w-full grid-cols-1 gap-x-[41px] gap-y-4 md:grid-cols-2 md:gap-y-6";

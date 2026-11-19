"use client";

import Link from "next/link";
import { MaskIcon } from "@/components/layout/mask-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ASSESSMENTS, assessmentHref } from "../constants";
import { useAssessmentsStore } from "../store";
import type { AssessmentMeta, AssessmentStatus } from "../types";
import { getAssessmentStatus } from "../utils";

const ARROW_ICON = "/images/assessments/arrow-right.svg";

const statusPill: Partial<Record<AssessmentStatus, { label: string; className: string }>> = {
  available: { label: "Available", className: "bg-[#effff1] text-[#059669]" },
  completed: { label: "Completed", className: "bg-brand-50 text-brand-800" },
};

function AssessmentAction({
  assessment,
  status,
}: {
  assessment: AssessmentMeta;
  status: AssessmentStatus;
}) {
  if (status === "locked") {
    return (
      <span className="inline-flex h-[34px] items-center rounded-[10px] border border-[#d5e4e3] px-[14px] text-[14px] leading-[1.2] font-medium text-[#102a2b]">
        Locked
      </span>
    );
  }

  const completed = status === "completed";
  return (
    <Button
      asChild
      variant={completed ? "brand-outline" : "brand"}
      className="h-12 w-full gap-[10px] rounded-[4px] px-4 text-[16px] leading-[1.2] font-medium sm:w-[234px]"
    >
      <Link href={assessmentHref(assessment.slug)}>
        {completed ? "Retake Assessment" : "Start Assessment"}
        <MaskIcon src={ARROW_ICON} size={16} className="rotate-90" />
      </Link>
    </Button>
  );
}

function AssessmentCard({ assessment }: { assessment: AssessmentMeta }) {
  const completed = useAssessmentsStore((state) => state.completed);
  const status = getAssessmentStatus(assessment, completed);
  const pill = statusPill[status];
  const titleId = `assessment-${assessment.slug}-title`;

  return (
    <li
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-4 rounded-[8px] bg-white py-4 pr-4 pl-5 drop-shadow-[4px_6px_4px_rgba(0,0,0,0.12)]",
        "sm:min-h-[142px] sm:flex-row sm:items-center sm:gap-2 sm:pr-6 sm:pl-8",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
        <div className="flex flex-wrap items-center gap-x-[19px] gap-y-2">
          <h2 id={titleId} className="text-[18px] leading-[1.5] font-normal text-ink">
            {assessment.title}
          </h2>
          {pill ? (
            <span
              className={cn(
                "inline-flex items-center rounded-[8px] px-4 py-2 text-[12px] leading-[1.2] font-light",
                pill.className,
              )}
            >
              {pill.label}
            </span>
          ) : null}
        </div>
        <p className="text-[16px] leading-[1.2] font-normal text-[#6a6a6a]">
          {assessment.description}
        </p>
      </div>

      <div className="flex shrink-0 flex-col gap-4 sm:min-h-[104px] sm:w-[234px] sm:items-end sm:justify-between sm:gap-6">
        <p className="text-[16px] leading-[1.2] font-light text-[#6a6a6a] sm:text-right">
          {assessment.duration}
        </p>
        <AssessmentAction assessment={assessment} status={status} />
      </div>
    </li>
  );
}

/** Application hub (Figma 11380:11553): the three assessment cards. */
export function AssessmentsHub() {
  return (
    <div className="px-4 py-5 sm:px-10">
      <ul className="flex flex-col gap-6" aria-label="Assessments">
        {ASSESSMENTS.map((assessment) => (
          <AssessmentCard key={assessment.slug} assessment={assessment} />
        ))}
      </ul>
    </div>
  );
}

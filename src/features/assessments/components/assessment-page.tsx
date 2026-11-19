"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_CONTENT, ASSESSMENTS_HUB_HREF, findAssessment } from "../constants";
import { useAssessmentsHydrated } from "../hooks/use-assessments-hydrated";
import { useAssessmentsStore } from "../store";
import type { AssessmentMeta } from "../types";
import { getAssessmentStatus } from "../utils";
import { AssessmentForm } from "./assessment-form";

function AssessmentNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="px-4 py-5 sm:px-10">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 rounded-[8px] bg-white px-6 py-10 text-center drop-shadow-[4px_6px_4px_rgba(0,0,0,0.12)]">
        <h2 className="text-[20px] leading-[1.2] font-semibold text-brand-900">{title}</h2>
        <p className="text-[16px] leading-[1.4] font-light text-muted-text">{message}</p>
        <Button asChild variant="brand" className="h-12 rounded-[4px] px-6 text-[16px]">
          <Link href={ASSESSMENTS_HUB_HREF}>Back to Assessments</Link>
        </Button>
      </div>
    </div>
  );
}

function UnavailableAssessment({ assessment }: { assessment: AssessmentMeta }) {
  const completed = useAssessmentsStore((state) => state.completed);
  const hydrated = useAssessmentsHydrated();
  if (!hydrated) return null;

  if (getAssessmentStatus(assessment, completed) === "locked") {
    const prerequisite = assessment.unlockedBy ? findAssessment(assessment.unlockedBy) : undefined;
    return (
      <AssessmentNotice
        title={`${assessment.title} is locked`}
        message={
          prerequisite
            ? `Complete "${prerequisite.title}" to unlock this assessment.`
            : "This assessment is not available yet."
        }
      />
    );
  }

  return (
    <AssessmentNotice
      title={`${assessment.title} — coming soon`}
      message="This assessment is unlocked, but its questions are not available yet. We'll let you know as soon as you can take it."
    />
  );
}

export function AssessmentPage({ slug }: { slug: string }) {
  const assessment = findAssessment(slug);
  const content = ASSESSMENT_CONTENT[slug];
  if (!assessment) return null;
  if (!content) return <UnavailableAssessment assessment={assessment} />;
  return <AssessmentForm slug={slug} content={content} />;
}

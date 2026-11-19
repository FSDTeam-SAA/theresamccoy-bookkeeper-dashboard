import type { Answers } from "../types";

export type SubmitAssessmentPayload = {
  slug: string;
  answers: Answers;
};

export type SubmitAssessmentResult = {
  slug: string;
  submittedAt: string;
};

/**
 * Submits a completed assessment.
 *
 * No backend endpoint exists yet, so this resolves locally. Swap the body for
 * the real request (e.g. `api.post("/assessments/:slug/submissions", ...)`
 * from `@/lib/api`) once the API is available; callers already await it and
 * handle rejection.
 */
export async function submitAssessment({
  slug,
}: SubmitAssessmentPayload): Promise<SubmitAssessmentResult> {
  return { slug, submittedAt: new Date().toISOString() };
}

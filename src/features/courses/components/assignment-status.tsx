"use client";

import { useCoursesHydrated } from "../hooks/use-courses-hydrated";
import { progressKey, useCoursesStore } from "../store";
import { StatusPill } from "./course-ui";

/** "Not Submitted" until a submission exists in persisted course progress. */
export function AssignmentStatus({
  slug,
  assignmentId,
}: {
  slug: string;
  assignmentId: string;
}) {
  const hydrated = useCoursesHydrated();
  const submission = useCoursesStore(
    (state) => state.submissions[progressKey(slug, assignmentId)],
  );

  return hydrated && submission ? (
    <StatusPill tone="completed">Submitted</StatusPill>
  ) : (
    <StatusPill tone="pending">Not Submitted</StatusPill>
  );
}

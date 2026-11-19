"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useApplicationsStore } from "@/store/applications.store";
import { SUBMISSIONS_HREF } from "../constants";
import type { ApplyDraft } from "../schema";
import { useOnboardingStore } from "../store";
import { ApplyStepper } from "./apply-stepper";
import { STEP_HEADING_ID } from "./fields";
import { PersonalStep } from "./personal-step";
import { ExperienceStep } from "./experience-step";
import { SkillsStep } from "./skills-step";
import { AssessmentStep } from "./assessment-step";
import { AvailabilityStep } from "./availability-step";

const noopSubscribe = () => () => {};

/** Maps the wizard draft onto the shared applications store payload. */
export function toApplication(draft: ApplyDraft) {
  const { credential, yearsExperience, industries } = draft.experience;
  return {
    professionalTitle:
      credential && credential !== "None" ? credential : "Bookkeeper",
    experience: yearsExperience || "Not specified",
    specializations: [
      ...new Set([...industries, ...draft.skills.coreSkills]),
    ].slice(0, 4),
    source: "onboarding" as const,
    resumeFileName: draft.assessment.resumeFileName || undefined,
  };
}

export function ApplyWizard() {
  // Persisted draft lives in localStorage: render only on the client.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const router = useRouter();
  const step = useOnboardingStore((s) => s.step);
  const goTo = useOnboardingStore((s) => s.goTo);
  const reset = useOnboardingStore((s) => s.reset);
  const submitApplication = useApplicationsStore((s) => s.submitApplication);
  const [submitting, setSubmitting] = useState(false);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(STEP_HEADING_ID)?.focus({ preventScroll: true });
  }, [step]);

  const submit = () => {
    setSubmitting(true);
    const application = submitApplication(
      toApplication(useOnboardingStore.getState().draft),
    );
    toast.success("Application submitted", {
      description: `Reference ${application.id}. We'll be in touch soon.`,
    });
    router.push(SUBMISSIONS_HREF);
    reset();
  };

  if (!mounted || submitting) {
    return (
      <div
        aria-busy="true"
        className="min-h-[663px] w-full rounded-lg bg-white drop-shadow-[4px_4px_6px_rgba(0,0,0,0.12)]"
      />
    );
  }

  const next = () => goTo(step + 1);
  const back = () => goTo(step - 1);
  const steps = [
    <PersonalStep key="personal" onNext={next} />,
    <ExperienceStep key="experience" onNext={next} onBack={back} />,
    <SkillsStep key="skills" onNext={next} onBack={back} />,
    <AssessmentStep key="assessment" onNext={next} onBack={back} />,
    <AvailabilityStep
      key="availability"
      onNext={submit}
      onBack={back}
      submitting={submitting}
    />,
  ];

  return (
    <>
      <ApplyStepper current={step} onSelect={goTo} />
      <div className="w-full rounded-lg bg-white p-4 drop-shadow-[4px_4px_6px_rgba(0,0,0,0.12)] sm:p-8">
        {steps[step]}
      </div>
    </>
  );
}

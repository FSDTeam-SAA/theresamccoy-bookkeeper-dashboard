"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "../store";
import { skillsSchema, type SkillsValues } from "../schema";
import {
  CORE_SKILLS,
  PROFICIENCY_LEVELS,
  SOFTWARE,
  SPECIALTY_TRACKS,
} from "../constants";
import { OptionGroup, SectionHeader, SelectControl } from "./fields";
import {
  StepActions,
  formClass,
  useDraftSync,
  type StepProps,
} from "./step-shared";

export function SkillsStep({ onNext, onBack }: StepProps) {
  const saved = useOnboardingStore((s) => s.draft.skills);
  const saveStep = useOnboardingStore((s) => s.saveStep);
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: saved,
  });
  useDraftSync(form, "skills");
  const { control } = form;

  return (
    <form
      noValidate
      className={formClass}
      onSubmit={form.handleSubmit((values) => {
        saveStep("skills", values);
        onNext();
      })}
    >
      <SectionHeader
        stepHeading
        variant="dark"
        title="Skills & software proficiency"
        subtitle="Rate your proficiency honestly — this informs your match quality"
      />
      <SectionHeader title="Software proficiency" />
      <Controller
        control={control}
        name="software"
        render={({ field }) => (
          <ul className="flex w-full flex-col gap-px rounded-lg bg-white p-0 sm:p-5">
            {SOFTWARE.map((tool, index) => {
              const id = `software-${index}`;
              return (
                <li
                  key={tool}
                  className="flex min-h-[60px] flex-col gap-2 border-b-[0.5px] border-black/65 py-2 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:gap-[150px]"
                >
                  <label
                    htmlFor={id}
                    className="flex-1 font-onest text-base leading-[1.2] text-ink"
                  >
                    {tool}
                  </label>
                  <div className="w-full sm:w-64 sm:shrink-0">
                    <SelectControl
                      id={id}
                      compact
                      options={PROFICIENCY_LEVELS}
                      value={field.value[tool] ?? ""}
                      onChange={(level) =>
                        field.onChange({ ...field.value, [tool]: level })
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      />
      <div className="flex w-full flex-col gap-4">
        <SectionHeader title="Core bookkeeping skills" />
        <Controller
          control={control}
          name="coreSkills"
          render={({ field }) => (
            <OptionGroup
              name="coreSkills"
              legend="Select all areas where you have solid, client-ready proficiency"
              options={CORE_SKILLS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-4">
        <SectionHeader title="Optional: specialty tracks interest" />
        <Controller
          control={control}
          name="tracks"
          render={({ field }) => (
            <OptionGroup
              name="tracks"
              columns={1}
              legend="Which additional training tracks would you like to complete on the platform? Each adds a verified badge to your profile."
              options={SPECIALTY_TRACKS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
      <StepActions onBack={onBack} />
    </form>
  );
}

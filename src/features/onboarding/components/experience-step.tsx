"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "../store";
import { experienceSchema, type ExperienceValues } from "../schema";
import { CREDENTIALS, INDUSTRIES, YEARS_OF_EXPERIENCE } from "../constants";
import {
  OptionGroup,
  SectionHeader,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields";
import {
  StepActions,
  formClass,
  gridClass,
  useDraftSync,
  type StepProps,
} from "./step-shared";

export function ExperienceStep({ onNext, onBack }: StepProps) {
  const saved = useOnboardingStore((s) => s.draft.experience);
  const saveStep = useOnboardingStore((s) => s.saveStep);
  const form = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: saved,
    mode: "onTouched",
  });
  useDraftSync(form, "experience");
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <form
      noValidate
      className={formClass}
      onSubmit={form.handleSubmit((values) => {
        saveStep("experience", values);
        onNext();
      })}
    >
      <SectionHeader
        stepHeading
        variant="dark"
        title="Professional experience"
        subtitle="Your background, credentials, and industry focus"
      />
      <SectionHeader title="Credentials and experience" />
      <div className={gridClass}>
        <Controller
          control={control}
          name="yearsExperience"
          render={({ field }) => (
            <SelectField
              id="yearsExperience"
              label="Years of bookkeeping experience"
              options={YEARS_OF_EXPERIENCE}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              triggerRef={field.ref}
            />
          )}
        />
        <Controller
          control={control}
          name="credential"
          render={({ field }) => (
            <SelectField
              id="credential"
              label="Highest bookkeeping credential"
              options={CREDENTIALS}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              triggerRef={field.ref}
            />
          )}
        />
        <TextField
          id="employer"
          label="Current or most recent employer / business"
          placeholder="Company name or Self-employed"
          autoComplete="organization"
          className="md:col-span-2"
          error={errors.employer?.message}
          {...register("employer")}
        />
      </div>
      <Controller
        control={control}
        name="industries"
        render={({ field }) => (
          <OptionGroup
            name="industries"
            legend="Which industries do you have experience bookkeeping for? Select all that apply *"
            options={INDUSTRIES}
            value={field.value}
            onChange={field.onChange}
            inputRef={field.ref}
            error={errors.industries?.message}
          />
        )}
      />
      <div className="flex w-full flex-col gap-4">
        <SectionHeader title="Brief professional summary" />
        <TextAreaField
          id="summary"
          label="Tell us about your bookkeeping background"
          placeholder="Describe your experience, the types of clients you've served, your strengths, and what makes you a great bookkeeper..."
          maxLength={2000}
          error={errors.summary?.message}
          {...register("summary")}
        />
      </div>
      <StepActions onBack={onBack} />
    </form>
  );
}

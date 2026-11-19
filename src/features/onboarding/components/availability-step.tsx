"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "../store";
import { availabilitySchema, type AvailabilityValues } from "../schema";
import {
  AVAILABILITY_DAYS,
  CONFIRMATIONS,
  ENGAGEMENT_TYPES,
  HOURLY_RATES,
  REFERRAL_SOURCES,
  RETAINER_INTEREST,
  WORK_ARRANGEMENTS,
} from "../constants";
import {
  CircleCheckbox,
  FieldError,
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

type SelectName =
  | "workArrangement"
  | "engagementType"
  | "hourlyRate"
  | "retainerInterest"
  | "referralSource";

export function AvailabilityStep({
  onNext,
  onBack,
  submitting,
}: StepProps & { submitting?: boolean }) {
  const saved = useOnboardingStore((s) => s.draft.availability);
  const saveStep = useOnboardingStore((s) => s.saveStep);
  const form = useForm<AvailabilityValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: saved,
    mode: "onTouched",
  });
  useDraftSync(form, "availability");
  const {
    control,
    register,
    formState: { errors },
  } = form;

  const select = (
    name: SelectName,
    label: string,
    options: readonly string[],
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <SelectField
          id={name}
          label={label}
          options={options}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          triggerRef={field.ref}
          error={errors[name]?.message}
        />
      )}
    />
  );

  return (
    <form
      noValidate
      className={formClass}
      onSubmit={form.handleSubmit((values) => {
        saveStep("availability", values);
        onNext();
      })}
    >
      <SectionHeader
        stepHeading
        variant="dark"
        title="Availability & rate"
        subtitle="Let us know when you're available and what you charge"
      />
      <div className={gridClass}>
        {select("workArrangement", "Work arrangement *", WORK_ARRANGEMENTS)}
        {select("engagementType", "Engagement type *", ENGAGEMENT_TYPES)}
      </div>
      <Controller
        control={control}
        name="days"
        render={({ field }) => (
          <OptionGroup
            name="days"
            legend="Availability days"
            options={AVAILABILITY_DAYS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <div className="flex w-full flex-col gap-4">
        <SectionHeader title="Hourly rate" />
        <div className={gridClass}>
          {select("hourlyRate", "Your hourly rate range *", HOURLY_RATES)}
          {select(
            "retainerInterest",
            "Monthly retainer interest",
            RETAINER_INTEREST,
          )}
        </div>
      </div>
      <div className="flex w-full flex-col gap-4">
        <SectionHeader title="How did you hear about us?" />
        <div className={gridClass}>
          {select("referralSource", "Referral source", REFERRAL_SOURCES)}
          <TextField
            id="referralName"
            label="Referral name (if applicable)"
            placeholder="Who referred you?"
            error={errors.referralName?.message}
            {...register("referralName")}
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4">
        <SectionHeader title="Additional notes" />
        <TextAreaField
          id="notes"
          label="Anything else you'd like us to know?"
          placeholder="Any additional context about your experience, schedule, client preferences, or questions for our team..."
          maxLength={2000}
          error={errors.notes?.message}
          {...register("notes")}
        />
      </div>
      <fieldset className="flex w-full flex-col gap-2">
        <legend className="sr-only">Confirmations</legend>
        {(Object.keys(CONFIRMATIONS) as (keyof typeof CONFIRMATIONS)[]).map(
          (name) => (
            <div key={name} className="flex flex-col gap-1">
              <CircleCheckbox
                id={name}
                label={`${CONFIRMATIONS[name]} *`}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
                {...register(name)}
              />
              <FieldError id={name} message={errors[name]?.message} />
            </div>
          ),
        )}
      </fieldset>
      <StepActions
        onBack={onBack}
        submitLabel="Submit my application →"
        submitting={submitting}
      />
    </form>
  );
}

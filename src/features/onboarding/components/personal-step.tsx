"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "../store";
import { personalSchema, type PersonalValues } from "../schema";
import { SectionHeader, TextField } from "./fields";
import {
  StepActions,
  formClass,
  gridClass,
  useDraftSync,
  type StepProps,
} from "./step-shared";

export function PersonalStep({ onNext }: StepProps) {
  const saved = useOnboardingStore((s) => s.draft.personal);
  const saveStep = useOnboardingStore((s) => s.saveStep);
  const form = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: saved,
    mode: "onTouched",
  });
  useDraftSync(form, "personal");
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form
      noValidate
      className={formClass}
      onSubmit={form.handleSubmit((values) => {
        saveStep("personal", values);
        onNext();
      })}
    >
      <SectionHeader
        stepHeading
        title="Personal information"
        subtitle="Tell us who you are and how to reach you"
      />
      <div className={gridClass}>
        <TextField
          id="firstName"
          label="First Name *"
          placeholder="Savannah"
          autoComplete="given-name"
          aria-required="true"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField
          id="lastName"
          label="Last Name *"
          placeholder="Nguyen"
          autoComplete="family-name"
          aria-required="true"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
        <TextField
          id="email"
          type="email"
          label="Email Address"
          placeholder="jessica.hanson@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="phone"
          type="tel"
          label="Phone Number"
          placeholder="(406) 555-0120"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <TextField
          id="city"
          label="City *"
          placeholder="New York City"
          autoComplete="address-level2"
          aria-required="true"
          error={errors.city?.message}
          {...register("city")}
        />
        <TextField
          id="state"
          label="State *"
          placeholder="New York"
          autoComplete="address-level1"
          aria-required="true"
          error={errors.state?.message}
          {...register("state")}
        />
        <TextField
          id="zip"
          label="ZIP code"
          placeholder="10001"
          autoComplete="postal-code"
          inputMode="numeric"
          error={errors.zip?.message}
          {...register("zip")}
        />
        <TextField
          id="linkedin"
          type="url"
          label="LinkedIn profile URL"
          placeholder="Optional but recommended — helps us verify your experience"
          error={errors.linkedin?.message}
          {...register("linkedin")}
        />
      </div>
      <StepActions />
    </form>
  );
}

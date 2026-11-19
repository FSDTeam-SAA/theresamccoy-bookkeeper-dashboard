"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useApplicationsStore } from "@/store/applications.store";
import {
  APPLICATIONS_ROUTE,
  CERTIFICATION_PLACEHOLDERS,
  ICONS,
  PDF_ACCEPT,
  RESUME_ACCEPT,
} from "../constants";
import {
  applicationSchema,
  type ApplicationFormInput,
  type ApplicationFormValues,
} from "../schema";
import { formatExperience } from "../utils";
import { ChipInput } from "./chip-input";
import { FileUploadButton } from "./file-upload-button";
import {
  addButton,
  fieldError,
  fieldLabel,
  formInput,
  sectionLabel,
} from "./form-styles";

const emptyRow = { title: "", year: "", document: undefined };

const defaultValues: ApplicationFormInput = {
  experience: "",
  skills: [],
  specializations: [],
  qualification: "",
  resume: undefined,
  coverLetter: undefined,
  certifications: [emptyRow],
};

/** Figma 11525:19323 — submit an application to become a bookkeeper. */
export function ApplicationForm() {
  const router = useRouter();
  const submitApplication = useApplicationsStore((s) => s.submitApplication);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormInput, unknown, ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const addRow = () => append(emptyRow);

  /** "Add": validate the last row, then start a fresh one. */
  const commitRow = async () => {
    const last = fields.length - 1;
    const valid = await trigger(`certifications.${last}`);
    if (!valid) return;
    if (!getValues(`certifications.${last}.title`).trim()) {
      toast.error("Enter a certification title before adding another.");
      return;
    }
    addRow();
  };

  const onSubmit = (values: ApplicationFormValues) => {
    const firstTitle = values.certifications
      .map((c) => c.title.trim())
      .find(Boolean);
    submitApplication({
      professionalTitle: firstTitle || "Bookkeeper",
      experience: formatExperience(values.experience),
      specializations: values.specializations,
      source: "dashboard",
      resumeFileName: values.resume?.name,
    });
    toast.success("Application submitted successfully.");
    router.push(APPLICATIONS_ROUTE);
  };

  return (
    <div className="px-4 py-6 sm:px-6">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        aria-labelledby="application-form-title"
        className="flex flex-col gap-6 rounded-lg bg-white px-4 py-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <h1
            id="application-form-title"
            className="font-onest text-[20px] leading-[1.2] font-semibold text-ink sm:text-[24px]"
          >
            Submit Application to become a Bookkeeper
          </h1>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Controller
                control={control}
                name="resume"
                render={({ field, fieldState }) => (
                  <FileUploadButton
                    id="application-resume"
                    label="Upload Resume"
                    inputLabel="Resume file (PDF, DOC or DOCX, max 5 MB)"
                    accept={RESUME_ACCEPT}
                    appearance="brand"
                    file={field.value}
                    onSelect={field.onChange}
                    buttonRef={field.ref}
                    invalid={Boolean(fieldState.error)}
                    describedBy={
                      fieldState.error ? "application-resume-error" : undefined
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="coverLetter"
                render={({ field, fieldState }) => (
                  <FileUploadButton
                    id="application-cover-letter"
                    label="Upload Cover Letter"
                    inputLabel="Cover letter file (optional, max 5 MB)"
                    accept={RESUME_ACCEPT}
                    appearance="brand-outline"
                    file={field.value}
                    onSelect={field.onChange}
                    buttonRef={field.ref}
                    invalid={Boolean(fieldState.error)}
                    describedBy={
                      fieldState.error ? "application-cover-error" : undefined
                    }
                  />
                )}
              />
            </div>
            {errors.resume ? (
              <p id="application-resume-error" className={fieldError}>
                {errors.resume.message}
              </p>
            ) : null}
            {errors.coverLetter ? (
              <p id="application-cover-error" className={fieldError}>
                {errors.coverLetter.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="application-experience" className={fieldLabel}>
            Experience in years
          </Label>
          <Input
            id="application-experience"
            inputMode="decimal"
            placeholder="6"
            aria-invalid={Boolean(errors.experience)}
            aria-describedby={
              errors.experience ? "application-experience-error" : undefined
            }
            className={formInput}
            {...register("experience")}
          />
          {errors.experience ? (
            <p id="application-experience-error" className={fieldError}>
              {errors.experience.message}
            </p>
          ) : null}
        </div>

        <Controller
          control={control}
          name="skills"
          render={({ field, fieldState }) => (
            <ChipInput
              id="application-skills"
              label="Skills & Appreciation"
              itemName="skill"
              placeholder="Add a Skill"
              values={field.value}
              onChange={field.onChange}
              inputRef={field.ref}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="specializations"
          render={({ field, fieldState }) => (
            <ChipInput
              id="application-specializations"
              label="Specialization"
              itemName="specialization"
              placeholder="Add a Specialization"
              values={field.value}
              onChange={field.onChange}
              inputRef={field.ref}
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="flex flex-col gap-3">
          <Label htmlFor="application-qualification" className={fieldLabel}>
            Last Educational Qualification
          </Label>
          <Input
            id="application-qualification"
            placeholder="Bachelors of Business Administration"
            aria-invalid={Boolean(errors.qualification)}
            aria-describedby={
              errors.qualification
                ? "application-qualification-error"
                : undefined
            }
            className={formInput}
            {...register("qualification")}
          />
          {errors.qualification ? (
            <p id="application-qualification-error" className={fieldError}>
              {errors.qualification.message}
            </p>
          ) : null}
        </div>

        <fieldset className="flex min-w-0 flex-col gap-2">
          <legend className={cn(sectionLabel, "mb-2")}>Certification</legend>
          <div className="flex flex-col gap-4">
            <div
              aria-hidden="true"
              className="hidden gap-5 font-onest text-[16px] leading-[1.2] text-ink md:flex"
            >
              <span className="flex-1">Title</span>
              <span className="w-[180px]">Year</span>
              <span className="w-[180px]">Document</span>
              {fields.length > 1 ? <span className="w-6" /> : null}
            </div>
            {fields.map((row, index) => {
              const rowErrors = errors.certifications?.[index];
              const placeholder = CERTIFICATION_PLACEHOLDERS[index];
              const n = index + 1;
              const errorId = `certification-${index}-error`;
              const messages = [
                rowErrors?.title?.message,
                rowErrors?.year?.message,
                rowErrors?.document?.message,
              ].filter(Boolean);
              return (
                <div key={row.id} className="flex flex-col gap-2">
                  <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-5">
                    <Input
                      aria-label={`Certification ${n} title`}
                      placeholder={placeholder?.title ?? "Certification title"}
                      aria-invalid={Boolean(rowErrors?.title)}
                      aria-describedby={messages.length ? errorId : undefined}
                      className={cn(formInput, "md:flex-1")}
                      {...register(`certifications.${index}.title`)}
                    />
                    <Input
                      aria-label={`Certification ${n} year`}
                      inputMode="numeric"
                      maxLength={4}
                      placeholder={placeholder?.year ?? "Year"}
                      aria-invalid={Boolean(rowErrors?.year)}
                      aria-describedby={messages.length ? errorId : undefined}
                      className={cn(formInput, "md:w-[180px] md:text-center")}
                      {...register(`certifications.${index}.year`)}
                    />
                    <Controller
                      control={control}
                      name={`certifications.${index}.document`}
                      render={({ field }) => (
                        <FileUploadButton
                          id={`certification-${index}-document`}
                          label="Upload PDF"
                          inputLabel={`Certification ${n} document (PDF, max 5 MB)`}
                          accept={PDF_ACCEPT}
                          appearance="field"
                          file={field.value}
                          onSelect={field.onChange}
                          buttonRef={field.ref}
                          invalid={Boolean(rowErrors?.document)}
                          describedBy={messages.length ? errorId : undefined}
                          className="md:w-[180px]"
                        />
                      )}
                    />
                    {fields.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        aria-label={`Remove certification ${n}`}
                        className="flex cursor-pointer items-center justify-center self-end rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 md:w-6 md:self-center"
                      >
                        <Image
                          src={ICONS.chipRemove}
                          width={16}
                          height={16}
                          alt=""
                        />
                      </button>
                    ) : null}
                  </div>
                  {messages.length ? (
                    <p id={errorId} className={fieldError}>
                      {messages.join(" · ")}
                    </p>
                  ) : null}
                </div>
              );
            })}
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={addRow}
                aria-label="Add another certification row"
                className="h-auto rounded-lg border-[#b5bec0] bg-white px-6 py-3 shadow-none hover:bg-mist"
              >
                <Image src={ICONS.plus} width={26} height={26} alt="" />
              </Button>
              <Button
                type="button"
                variant="brand"
                onClick={commitRow}
                aria-label="Add certification"
                className={addButton}
              >
                Add
              </Button>
            </div>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            variant="brand"
            disabled={isSubmitting}
            className="h-[42px] p-4 text-[14px] leading-[1.5] font-semibold"
          >
            Submit Application
          </Button>
          <Link
            href={APPLICATIONS_ROUTE}
            className={cn(
              buttonVariants({ variant: "brand-muted" }),
              "h-[42px] bg-[#e3e3e3] p-4 text-[14px] leading-[1.5] font-semibold text-[#031515]",
            )}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

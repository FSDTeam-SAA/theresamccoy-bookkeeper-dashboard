"use client";

import type { ComponentProps, ReactNode, Ref } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const STEP_HEADING_ID = "apply-step-heading";

const errorId = (id: string) => `${id}-error`;

const fieldClass =
  "h-[58px] rounded-lg border-black/30 bg-white px-4 font-onest text-base text-ink shadow-none placeholder:text-[#999] focus-visible:border-brand-400 focus-visible:ring-brand-400/30 md:text-base";

/* ---------- Section headers ---------- */

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** Dark = step title bar, muted = grey-teal sub-section bar. */
  variant?: "dark" | "muted";
  /** Marks this heading as the focus target on step change. */
  stepHeading?: boolean;
};

export function SectionHeader({
  title,
  subtitle,
  variant = "muted",
  stepHeading,
}: SectionHeaderProps) {
  const Heading = stepHeading ? "h2" : "h3";
  const dark = variant === "dark";
  return (
    <div
      className={cn(
        "flex w-full flex-col justify-center gap-2.5 rounded-lg px-5 py-4 font-onest",
        dark ? "bg-brand-900" : "bg-[#b3c7c6]",
      )}
    >
      <Heading
        id={stepHeading ? STEP_HEADING_ID : undefined}
        tabIndex={stepHeading ? -1 : undefined}
        className={cn(
          "text-xl leading-[1.2] font-semibold outline-none sm:text-2xl",
          dark ? "text-mist-50" : "text-[#1e1e1e]",
        )}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "text-sm leading-[1.2]",
            dark ? "text-[#fbfdfc]" : "text-[#595959]",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------- Shared label / error ---------- */

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(id)} role="alert" className="text-destructive text-sm">
      {message}
    </p>
  );
}

function FieldShell({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="font-onest text-base leading-[1.2] text-ink"
      >
        {label}
      </label>
      {children}
      <FieldError id={id} message={error} />
    </div>
  );
}

const a11y = (id: string, error?: string) => ({
  "aria-invalid": Boolean(error),
  "aria-describedby": error ? errorId(id) : undefined,
});

/* ---------- Text input ---------- */

type TextFieldProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
};

export function TextField({
  id,
  label,
  error,
  className,
  ...props
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} className={className}>
      <Input id={id} className={fieldClass} {...a11y(id, error)} {...props} />
    </FieldShell>
  );
}

/* ---------- Textarea ---------- */

type TextAreaFieldProps = ComponentProps<typeof Textarea> & {
  id: string;
  label: string;
  error?: string;
};

export function TextAreaField({
  id,
  label,
  error,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} className={className}>
      <div className="relative">
        <Textarea
          id={id}
          className={cn(
            fieldClass,
            "field-sizing-fixed h-[157px] resize-y p-4 pr-10",
          )}
          {...a11y(id, error)}
          {...props}
        />
        {/* Decorative caret drawn in the Figma textarea */}
        <Image
          src="/images/apply/caret-down.svg"
          width={16}
          height={16}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-4 right-4"
        />
      </div>
    </FieldShell>
  );
}

/* ---------- Select ---------- */

type SelectControlProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  error?: string;
  /** Accessible name when there is no visible <label> (table rows). */
  ariaLabel?: string;
  compact?: boolean;
  triggerRef?: Ref<HTMLButtonElement>;
};

export function SelectControl({
  id,
  value,
  onChange,
  onBlur,
  options,
  error,
  ariaLabel,
  compact,
  triggerRef,
}: SelectControlProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      onOpenChange={(open) => !open && onBlur?.()}
    >
      <SelectTrigger
        id={id}
        ref={triggerRef}
        aria-label={ariaLabel}
        {...a11y(id, error)}
        className={cn(
          fieldClass,
          "w-full gap-2.5 text-left data-[placeholder]:text-[#999] data-[size=default]:h-[58px] [&>svg]:hidden",
          compact && "data-[size=default]:h-[46px]",
        )}
      >
        <SelectValue placeholder="Please Select" />
        <Image
          src="/images/apply/caret-down.svg"
          width={16}
          height={16}
          alt=""
          aria-hidden="true"
          className="shrink-0"
        />
      </SelectTrigger>
      <SelectContent className="bg-white font-onest">
        {options.map((option) => (
          <SelectItem key={option} value={option} className="text-base">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SelectField({
  label,
  ...props
}: SelectControlProps & { label: string }) {
  return (
    <FieldShell id={props.id} label={label} error={props.error}>
      <SelectControl {...props} />
    </FieldShell>
  );
}

/* ---------- Circle checkbox (design draws options as circles) ---------- */

type CircleCheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
};

export function CircleCheckbox({
  label,
  className,
  ...props
}: CircleCheckboxProps) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-start gap-3 font-onest text-base leading-[1.2] text-ink",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="relative size-6 shrink-0 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400 peer-aria-invalid:ring-1 peer-aria-invalid:ring-destructive">
        <Image
          src="/images/apply/option-circle.svg"
          width={24}
          height={24}
          alt=""
          aria-hidden="true"
        />
        <span className="absolute inset-[6px] hidden rounded-full bg-brand-900 group-has-checked:block" />
      </span>
      <span className="min-w-0 pt-[3px]">{label}</span>
    </label>
  );
}

/* ---------- Multi-select group ---------- */

type OptionGroupProps = {
  name: string;
  legend: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  columns?: 1 | 2;
  inputRef?: Ref<HTMLInputElement>;
};

export function OptionGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  columns = 2,
  inputRef,
}: OptionGroupProps) {
  const toggle = (option: string, checked: boolean) =>
    onChange(
      checked
        ? options.filter((o) => o === option || value.includes(o))
        : value.filter((v) => v !== option),
    );
  // Fill column-wise like the design (first half left, rest right).
  const half = Math.ceil(options.length / 2);
  return (
    <fieldset
      className="flex w-full min-w-0 flex-col gap-2"
      aria-describedby={error ? errorId(name) : undefined}
    >
      <legend className="mb-2 font-onest text-lg leading-[1.2] font-semibold text-ink sm:text-xl">
        {legend}
      </legend>
      <div
        className={cn(
          "grid gap-x-2 gap-y-2",
          columns === 2 && "md:grid-flow-col md:grid-cols-2",
        )}
        style={
          columns === 2
            ? { gridTemplateRows: `repeat(${half}, auto)` }
            : undefined
        }
      >
        {options.map((option, index) => (
          <CircleCheckbox
            key={option}
            ref={index === 0 ? inputRef : undefined}
            name={name}
            value={option}
            label={option}
            checked={value.includes(option)}
            onChange={(e) => toggle(option, e.target.checked)}
            aria-invalid={Boolean(error)}
          />
        ))}
      </div>
      <FieldError id={name} message={error} />
    </fieldset>
  );
}

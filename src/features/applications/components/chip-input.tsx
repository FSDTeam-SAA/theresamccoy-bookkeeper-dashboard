"use client";

import { useState, type Ref } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ICONS } from "../constants";
import { addButton, fieldError, formInput, sectionLabel } from "./form-styles";

type ChipInputProps = {
  id: string;
  label: string;
  /** Name used in the Add / Remove button labels, e.g. "skill". */
  itemName: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

/** Text input + Add button that collects unique, trimmed chips. */
export function ChipInput({
  id,
  label,
  itemName,
  placeholder,
  values,
  onChange,
  error,
  inputRef,
}: ChipInputProps) {
  const [draft, setDraft] = useState("");
  const errorId = `${id}-error`;

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    const exists = values.some((v) => v.toLowerCase() === value.toLowerCase());
    if (!exists) onChange([...values, value]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={sectionLabel}>
        {label}
      </Label>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <Input
            ref={inputRef}
            id={id}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(formInput, "flex-1")}
          />
          <Button
            type="button"
            variant="brand"
            onClick={add}
            aria-label={`Add ${itemName}`}
            className={addButton}
          >
            Add
          </Button>
        </div>
        {values.length > 0 ? (
          <ul className="flex flex-wrap gap-3" aria-label={`${label} added`}>
            {values.map((value) => (
              <li
                key={value}
                className="flex items-center gap-[10px] rounded-[4px] bg-[rgba(179,199,198,0.35)] px-3 py-2 font-onest text-[14px] leading-[1.2] font-normal text-ink-400"
              >
                {value}
                <button
                  type="button"
                  onClick={() => onChange(values.filter((v) => v !== value))}
                  aria-label={`Remove ${value}`}
                  className="flex cursor-pointer items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50"
                >
                  <Image src={ICONS.chipRemove} width={16} height={16} alt="" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {error ? (
          <p id={errorId} className={fieldError}>
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

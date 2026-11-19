"use client";

import { useRef, type Ref } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ICONS } from "../constants";

type Appearance = "brand" | "brand-outline" | "field";

const ICON: Record<Appearance, string> = {
  brand: ICONS.uploadLight,
  "brand-outline": ICONS.uploadBrand,
  field: ICONS.uploadMuted,
};

type FileUploadButtonProps = {
  id: string;
  label: string;
  /** Accessible name of the hidden file input, e.g. "Resume file". */
  inputLabel: string;
  accept: string;
  appearance: Appearance;
  file?: File;
  onSelect: (file: File | undefined) => void;
  invalid?: boolean;
  describedBy?: string;
  buttonRef?: Ref<HTMLButtonElement>;
  className?: string;
};

/** Button that opens a native file picker and shows the chosen file name. */
export function FileUploadButton({
  id,
  label,
  inputLabel,
  accept,
  appearance,
  file,
  onSelect,
  invalid,
  describedBy,
  buttonRef,
  className,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        aria-label={inputLabel}
        tabIndex={-1}
        className="sr-only"
        onChange={(e) => {
          onSelect(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <Button
        ref={buttonRef}
        type="button"
        variant={appearance === "field" ? "outline" : appearance}
        onClick={() => inputRef.current?.click()}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        title={file?.name}
        className={cn(
          appearance === "field"
            ? "h-auto w-full rounded-lg border-[#c3c3c3] bg-white p-4 font-onest text-[16px] leading-[1.2] font-light text-ink-400 shadow-none hover:bg-mist"
            : "h-[42px] p-4 text-[14px] leading-[1.5] font-semibold",
          className,
        )}
      >
        <span className="max-w-[180px] truncate">
          {file ? file.name : label}
        </span>
        <Image src={ICON[appearance]} width={16} height={16} alt="" />
      </Button>
    </>
  );
}

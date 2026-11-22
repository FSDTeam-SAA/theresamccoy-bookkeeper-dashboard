"use client";

import { useState, type ComponentProps } from "react";
import Image from "next/image";
import { EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ICONS } from "../constants";
import { passwordInput } from "./settings-styles";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  /** Accessible name fragment for the reveal toggle, e.g. "new password". */
  revealLabel?: string;
};

/** Password field with an optional show/hide toggle (Figma eye icon). */
export function PasswordInput({
  revealLabel,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(passwordInput, revealLabel && "pr-12", className)}
      />
      {revealLabel ? (
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={`${visible ? "Hide" : "Show"} ${revealLabel}`}
          aria-pressed={visible}
          className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[4px] text-[#6c6c6c] outline-none hover:bg-mist focus-visible:ring-[3px] focus-visible:ring-brand-400/40"
        >
          {visible ? (
            <EyeOff size={22} aria-hidden="true" />
          ) : (
            <Image src={ICONS.eye} width={24} height={24} alt="" />
          )}
        </button>
      ) : null}
    </div>
  );
}

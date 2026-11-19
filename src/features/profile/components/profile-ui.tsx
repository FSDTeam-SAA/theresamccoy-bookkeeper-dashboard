import Image from "next/image";
import { cn } from "@/lib/utils";
import { PROFILE_ICONS } from "../constants";
import type { Profile } from "../types";

/** Shared input look from the design: 1px #c3c3c3 border, 8px radius, 16px padding. */
export const fieldClass =
  "h-auto rounded-[8px] border-[#c3c3c3] bg-white p-4 font-onest text-[16px] leading-[1.2] font-light text-ink-400 shadow-none md:text-[16px] placeholder:text-grey-200 focus-visible:border-brand-400 focus-visible:ring-brand-400/30";

export const fieldLabelClass =
  "font-onest text-[16px] leading-[1.2] font-normal text-ink";

export const fieldErrorClass = "font-onest text-[14px]";

/** Dark "Add"/"Save" button used at the end of every edit section. */
export const sectionButtonClass =
  "h-auto rounded-[8px] px-10 py-4 text-[16px] leading-[1.2] font-medium";

export function ProfileIcon({
  src,
  size,
  className,
}: {
  src: string;
  size: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}

export function SectionCard({
  title,
  titleId,
  className,
  children,
}: {
  title: string;
  titleId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex w-full flex-col gap-5 rounded-[12px] bg-white p-4 sm:p-5",
        className,
      )}
    >
      <h2
        id={titleId}
        className="font-onest text-[20px] leading-[1.2] font-medium text-ink sm:text-[24px]"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ListDivider() {
  return (
    <Image
      src={PROFILE_ICONS.divider}
      alt=""
      aria-hidden="true"
      width={1446}
      height={1}
      className="block h-px w-full"
    />
  );
}

export function ProfilePhoto({
  src,
  objectPosition = "center",
  unoptimized,
}: {
  src: string;
  objectPosition?: string;
  unoptimized?: boolean;
}) {
  return (
    <Image
      src={src}
      alt="Profile photo"
      fill
      sizes="230px"
      unoptimized={unoptimized}
      className="rounded-[8px] object-cover"
      style={{ objectPosition }}
    />
  );
}

/** "Sydney · English · Mandarin · 8yr exp · Full-time" row under the headline. */
export function ProfileMeta({ profile }: { profile: Profile }) {
  const items = [
    { icon: PROFILE_ICONS.location, text: profile.personal.location },
    { icon: PROFILE_ICONS.dot, text: profile.other.languages },
    { icon: PROFILE_ICONS.dot, text: `${profile.other.experienceYears}yr exp` },
    { icon: PROFILE_ICONS.dot, text: profile.other.availability },
  ];
  return (
    <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-center gap-1 font-onest text-[16px] leading-[1.5] font-light text-[#6a6a6a] sm:text-[18px]"
        >
          <ProfileIcon src={item.icon} size={16} />
          {item.text}
        </li>
      ))}
    </ul>
  );
}

export const chipClass =
  "flex items-center justify-center rounded-[4px] bg-[rgba(179,199,198,0.35)] px-3 py-2 font-onest text-[14px] leading-[1.2] font-normal text-ink-400";

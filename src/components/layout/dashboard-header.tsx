"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MaskIcon } from "./mask-icon";

type DashboardHeaderProps =
  | { title: string; subtitle?: string; back?: never }
  | { back: { href: string; label: string }; title?: never; subtitle?: never };

/** Page header bar (Figma: 140px deep-teal-50 strip with avatar on the right). */
export function DashboardHeader(props: DashboardHeaderProps) {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";

  return (
    <header className="flex min-h-[140px] items-center bg-brand-50 px-4 py-5 sm:px-10">
      <div className="flex w-full items-center justify-between gap-6">
        {props.back ? (
          <Link
            href={props.back.href}
            className="flex items-center gap-2 font-onest text-[20px] leading-[1.2] font-light text-muted-text hover:text-brand-900"
          >
            <MaskIcon
              src="/images/dashboard/arrow-up-line.svg"
              className="-rotate-90"
            />
            {props.back.label}
          </Link>
        ) : (
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="font-onest text-[26px] leading-[1.2] font-medium text-brand-900 sm:text-[32px]">
              {props.title}
            </h1>
            {props.subtitle ? (
              <p className="font-onest text-[16px] leading-[1.2] font-light text-muted-text sm:text-[20px]">
                {props.subtitle}
              </p>
            ) : null}
          </div>
        )}
        <span className="relative size-[56px] shrink-0 overflow-hidden rounded-full sm:size-[70px]">
          <Image
            src="/images/dashboard/avatar.png"
            alt={name ? `${name}'s profile photo` : "Profile photo"}
            fill
            sizes="70px"
            className="object-cover"
          />
        </span>
      </div>
    </header>
  );
}

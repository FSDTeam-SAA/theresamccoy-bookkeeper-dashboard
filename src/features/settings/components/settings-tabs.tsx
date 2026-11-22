"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SETTINGS_HREF, SETTINGS_TABS } from "../constants";

/** Profile / Password segmented control; each tab is its own route. */
export function SettingsTabs() {
  const pathname = usePathname();
  const active =
    SETTINGS_TABS.find(
      (tab) => tab.href !== SETTINGS_HREF && pathname.startsWith(tab.href),
    )?.id ?? "profile";

  return (
    <nav aria-label="Settings sections">
      <ul className="flex items-center gap-2 rounded-[8px] border border-brand-900 bg-white p-2 drop-shadow-[0px_4px_2px_rgba(82,114,255,0.1)] sm:gap-6">
        {SETTINGS_TABS.map((tab) => {
          const current = tab.id === active;
          return (
            <li key={tab.id} className="flex-1">
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center justify-center rounded-[4px] px-4 font-onest text-[16px] leading-[1.2] transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-brand-400/50",
                  current
                    ? "bg-brand-900 font-semibold text-mist"
                    : "bg-mist font-light text-brand-900 hover:bg-brand-50",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

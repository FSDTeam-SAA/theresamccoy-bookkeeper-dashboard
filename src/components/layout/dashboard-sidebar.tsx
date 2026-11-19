"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { MaskIcon } from "./mask-icon";
import { dashboardNavItems, isNavItemActive } from "./nav-items";

const itemBase =
  "flex h-[60px] w-full max-w-[354px] items-center gap-4 rounded-[6px] pl-8 font-onest text-[18px] leading-[1.2] transition-colors";

export function DashboardSidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-12 px-4 py-6 lg:px-[16px]",
        className,
      )}
    >
      <BrandLogo />
      <nav aria-label="Dashboard" className="flex w-full flex-col items-center">
        <ul className="flex w-full flex-col items-center gap-4">
          {dashboardNavItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const content = (
              <>
                <MaskIcon src={item.icon} size={active ? (item.iconSize ?? 24) : 24} />
                <span>{item.label}</span>
              </>
            );
            return (
              <li key={item.label} className="flex w-full justify-center">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      itemBase,
                      active
                        ? "border-l-6 border-brand-400 bg-brand-900 pl-[26px] font-medium text-brand-50 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.1)]"
                        : "font-light text-brand-800 hover:bg-brand-900/5",
                    )}
                  >
                    {content}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    title="Coming soon"
                    className={cn(itemBase, "cursor-default font-light text-brand-800")}
                  >
                    {content}
                  </span>
                )}
              </li>
            );
          })}
          <li className="flex w-full justify-center">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={cn(
                itemBase,
                "cursor-pointer font-normal text-alert hover:bg-alert/5",
              )}
            >
              <MaskIcon src="/images/dashboard/nav/logout.svg" />
              <span>Log Out</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

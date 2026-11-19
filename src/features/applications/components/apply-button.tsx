import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NEW_APPLICATION_ROUTE } from "../constants";

/** Figma: #063231, h 42, radius 8, Onest SemiBold 14 #f7faf9. */
export function ApplyButton({ className }: { className?: string }) {
  return (
    <Link
      href={NEW_APPLICATION_ROUTE}
      className={cn(
        buttonVariants({ variant: "brand" }),
        "h-[42px] p-4 text-[14px] leading-[1.5] font-semibold",
        className,
      )}
    >
      Apply as a Bookkeeper
    </Link>
  );
}

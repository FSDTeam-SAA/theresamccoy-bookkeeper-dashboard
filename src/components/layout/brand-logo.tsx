import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Bookkeepers Marketplace logo, cropped exactly as the Figma "image 154" frame. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      aria-label="Bookkeepers Marketplace dashboard"
      className={cn("relative block h-[88px] w-[100px] shrink-0", className)}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute top-[-25.33%] left-[-16.13%] h-[149.11%] w-[131.31%]">
          <Image
            src="/images/dashboard/logo.png"
            alt=""
            fill
            priority
            sizes="132px"
            className="object-fill"
          />
        </span>
      </span>
    </Link>
  );
}

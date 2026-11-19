import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a Figma-exported SVG as a CSS mask so it can inherit `currentColor`
 * (e.g. nav icons that turn white when active) without editing the asset.
 */
export function MaskIcon({
  src,
  size = 24,
  className,
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  const style: CSSProperties = {
    width: size,
    height: size,
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "contain",
    WebkitMaskSize: "contain",
  };
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={style}
    />
  );
}

import type { Metadata } from "next";
import {
  Hanken_Grotesk,
  Libre_Caslon_Text,
  Onest,
  Syne,
} from "next/font/google";
import { AuthShell } from "@/features/auth/components/auth-shell";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  preload: false,
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
  preload: false,
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  preload: false,
});

const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  variable: "--font-caslon",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${syne.variable} ${onest.variable} ${hanken.variable} ${caslon.variable}`}
    >
      <AuthShell>{children}</AuthShell>
    </div>
  );
}

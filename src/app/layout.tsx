import type { Metadata } from "next";
import { connection } from "next/server";
import {
  Instrument_Sans,
  Onest,
  Poppins,
  Wix_Madefor_Text,
} from "next/font/google";
import "./globals.css";
import MainProviders from "@/Providers/MainProviders";
import Provider from "@/Providers/Provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const onest = Onest({
  variable: "--font-onest-face",
  subsets: ["latin"],
  display: "swap",
});

const wix = Wix_Madefor_Text({
  variable: "--font-wix-face",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const instrument = Instrument_Sans({
  variable: "--font-instrument-face",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Bookkeeper Dashboard | The Bookkeepers Marketplace",
  description:
    "Manage your Bookkeepers Marketplace profile, assessments, and applications.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A fresh CSP nonce requires rendering each document per request.
  await connection();
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${onest.variable} ${wix.variable} ${instrument.variable} antialiased`}
      >
        <MainProviders>
          <Provider> {children} </Provider>
        </MainProviders>
        <Toaster position="top-right" closeButton />
      </body>
    </html>
  );
}

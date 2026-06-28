import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";

import { CrowAppShell } from "@/components/brand/crow-app-shell";
import { RouteProgressBar } from "@/components/ui/route-progress-bar";
import { CertificationEnvironmentLabel } from "@/components/public/certification-environment-label";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Crow Ecosystem Platform",
  description:
    "Multi-tenant adaptive enterprise operating platform — CEM runs, CyberCrow protects, SAREA adapts.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#04060c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="font-sans antialiased">
        <RouteProgressBar />
        <CrowAppShell>{children}</CrowAppShell>
        <CertificationEnvironmentLabel />
      </body>
    </html>
  );
}

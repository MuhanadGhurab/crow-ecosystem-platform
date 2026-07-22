import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "../lib/locale-context";

export const metadata: Metadata = { title: "GHURAVIA" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}

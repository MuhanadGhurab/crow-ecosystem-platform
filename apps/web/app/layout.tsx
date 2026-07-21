import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Ghuravia Foundation" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <a className="skip-link" href="#main">
          انتقل إلى المحتوى
        </a>
        <header role="banner">GHURAVIA</header>
        {children}
      </body>
    </html>
  );
}

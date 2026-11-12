// ======================================================================
// moataz-portfolio-v4
// Copyright (c) 2026 Moataz Mohamed <mtzm2225@gmail.com> — all rights reserved.
// Author: Moataz Mohamed  <https://github.com/moatazsmohamed>
// Fingerprint: e8fa428b72fc0e43a2632e36723784d1
// This notice is part of the work and must not be removed.
// ======================================================================
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "معتز محمد | مطوّر واجهات أمامية",
  description:
    "معرض أعمال معتز محمد — مطوّر واجهات أمامية من الإسكندرية، أبني منتجات ويب عربية سريعة وواضحة بـ React و Next.js و Supabase.",
  keywords: [
    "معتز محمد",
    "Moataz Mohamed",
    "Frontend Developer",
    "مطور واجهات أمامية",
    "React",
    "Next.js",
    "Alexandria",
    "portfolio",
  ],
  authors: [{ name: "Moataz Mohamed" }],
  openGraph: {
    title: "معتز محمد | مطوّر واجهات أمامية",
    description:
      "أبني منتجات ويب عربية سريعة وواضحة — من الفكرة والتصميم لحد النشر.",
    type: "website",
    locale: "ar_EG",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { AuthGate } from "@/components/auth/AuthGate";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "LDPEC Portal",
    template: "%s · LDPEC Portal",
  },
  description:
    "Louisville Democratic Party Executive Committee — internal portal. Roles, committees, canvass tools, and the reorg ahead.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "LDPEC Portal",
    description: "Louisville Democratic Party Executive Committee — internal portal.",
    siteName: "LDPEC Portal",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "LDPEC Portal",
    description: "Louisville Democratic Party Executive Committee — internal portal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthGate>{children}</AuthGate>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

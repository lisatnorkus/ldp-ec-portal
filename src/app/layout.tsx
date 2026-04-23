import type { Metadata, Viewport } from "next";
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

// Without this, iOS Safari defaults to a ~980px virtual viewport on
// phones and scales the page down to fit, forcing pinch-zoom to read
// anything. device-width makes the browser honor the actual screen
// width so the responsive breakpoints kick in as designed.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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

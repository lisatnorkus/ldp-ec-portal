import type { Metadata } from "next";
import "./globals.css";
import { AuthGate } from "@/components/auth/AuthGate";

export const metadata: Metadata = {
  title: "LDPEC Portal",
  description: "Louisville Democratic Party Executive Committee — internal portal.",
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
      </body>
    </html>
  );
}

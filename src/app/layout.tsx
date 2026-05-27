import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { AffiliateProvider } from "@/modules/affiliates/model/AffiliateContext";
import { DashboardProvider } from "@/modules/dashboard/model/DashboardContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JL Management",
  description: "Sistema interno para gestionar afiliados y aportes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DashboardProvider>
          <AffiliateProvider>
            <AppLayout>{children}</AppLayout>
          </AffiliateProvider>
        </DashboardProvider>
      </body>
    </html>
  );
}

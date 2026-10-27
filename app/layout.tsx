import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PredictiveMaintenanceProvider } from "@/context/PredictiveMaintenanceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PREDIX AI // Enterprise Industrial Predictive Maintenance",
  description:
    "Real-time industrial IoT asset intelligence, FFT vibration harmonic analysis, ML failure prediction, and autonomous work order dispatching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}
    >
      <body className="h-full w-full bg-slate-950 text-slate-100 flex flex-col">
        <PredictiveMaintenanceProvider>{children}</PredictiveMaintenanceProvider>
      </body>
    </html>
  );
}

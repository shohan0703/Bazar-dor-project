import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        <Suspense fallback={<header className="h-16 bg-[#f9fcfa]" />}>
          <Navbar />
        </Suspense>
        <PriceTicker />
        {children}
        <Footer />
      </body>
    </html>
  );
}
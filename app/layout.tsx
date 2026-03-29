import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import ToastHost from "@/components/ui/ToastHost";

export const metadata: Metadata = {
  title: "Mera Halwai",
  description: "Premium catering marketplace for Jaipur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFAF5] text-[#1E1E1E]">
        <div className="flex min-h-screen flex-col">
          <ToastHost />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

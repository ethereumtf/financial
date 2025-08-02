import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AccountAbstractionProvider } from "@/contexts/AccountAbstractionContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "USD Financial - Modern Banking Experience",
  description: "Next-generation digital banking platform for the modern user. Manage finances, make payments, and invest with AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AccountAbstractionProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </AccountAbstractionProvider>
      </body>
    </html>
  );
}

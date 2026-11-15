import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "BTC Copilot — Intelligent Bitcoin Wallet Assistant",
  description: "AI-powered Bitcoin wallet intelligence platform for on-chain and Lightning transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark h-full">
      <body className="min-h-full bg-[#090a0f] text-neutral-100 antialiased flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

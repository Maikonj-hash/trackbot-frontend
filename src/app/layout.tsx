import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayoutWrapper } from "@/components/app-layout-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrackBot | Workspace",
  description: "Advanced WhatsApp Chatbot & CRM Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-background antialiased overflow-hidden`}>
        <TooltipProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}

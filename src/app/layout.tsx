import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased overflow-hidden`}>
        <TooltipProvider>
          {/* Aqui injetamos o Contexto do Shadcn Sidebar que afeta a aplicação inteira */}
          <SidebarProvider>
            <AppSidebar />
            <main className="relative flex flex-col flex-1 min-w-0 overflow-hidden h-screen">
              <div className="flex h-12 items-center border-b border-border/10 px-4">
                {/* Trigger Hamburger menu mobile/collapsed */}
                <SidebarTrigger />
              </div>
              <div className="flex-1 overflow-auto flex flex-col relative w-full h-full">
                <Providers>{children}</Providers>
              </div>
            </main>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}

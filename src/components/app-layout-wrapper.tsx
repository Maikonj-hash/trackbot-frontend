"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Providers } from "@/app/providers";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isStudioEditor = pathname?.startsWith("/studio/editor");

    if (isStudioEditor) {
        // Distraction-free mode (100% Canvas Focus)
        return (
            <main className="relative flex flex-col flex-1 min-w-0 overflow-hidden h-screen w-full bg-background">
                <Providers>{children}</Providers>
            </main>
        );
    }

    // Default Dashboard mode
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="relative flex flex-col flex-1 min-w-0 overflow-hidden h-screen">
                <div className="flex h-12 items-center border-b border-border/10 px-4 bg-background">
                    {/* Trigger Hamburger menu mobile/collapsed */}
                    <SidebarTrigger />
                </div>
                <div className="flex-1 overflow-auto flex flex-col relative w-full h-full bg-background">
                    <Providers>{children}</Providers>
                </div>
            </main>
        </SidebarProvider>
    );
}

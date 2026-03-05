"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, LayoutDashboard, MessageSquareText, Workflow, Phone, Settings } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    useSidebar
} from "@/components/ui/sidebar"

// Grupos lógicos de navegação para SaaS
const navGroups = [
    {
        label: "OPERAÇÃO",
        items: [
            { title: "Dashboard", url: "/", icon: LayoutDashboard },
            { title: "Meus Fluxos", url: "/studio", icon: Workflow },
            { title: "Clientes", url: "/clientes", icon: MessageSquareText },
        ]
    },
    {
        label: "INFRAESTRUTURA",
        items: [
            { title: "Aparelhos", url: "/instances", icon: Phone },
        ]
    }
]

export function AppSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="border-b border-border/10 py-5">
                <div className="flex flex-col items-center justify-center gap-3 px-2">
                    <div className="flex h-16 w-full max-w-[180px] items-center justify-center relative rounded-md group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 transition-all">
                        <Image
                            src={state === "collapsed" ? "/logo2.png" : "/logo1.png"}
                            alt="TrackBot Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url));

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                isActive={isActive}
                                                className="transition-colors hover:bg-blue-600/10 hover:text-blue-600 data-[active=true]:bg-blue-600/15 data-[active=true]:text-blue-600"
                                            >
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span className="font-medium tracking-tight">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-border/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Configurações">
                            <Settings />
                            <span>Configurações</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

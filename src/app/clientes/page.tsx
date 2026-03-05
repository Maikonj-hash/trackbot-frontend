"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Filter, Download, MoreHorizontal, Edit2, Phone, Calendar, Tag } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ClientesTable } from "@/components/clientes/clientes-table"
import { ClienteEditModal } from "@/components/clientes/cliente-edit-modal"

export default function ClientesPage() {
    const [search, setSearch] = useState("")
    const [instanceId, setInstanceId] = useState("")
    const [clientes, setClientes] = useState<any[]>([])
    const [instances, setInstances] = useState<any[]>([])
    const [meta, setMeta] = useState<any>({ total: 0, page: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [selectedCliente, setSelectedCliente] = useState<any>(null)
    const [page, setPage] = useState(1)

    const fetchInstances = async () => {
        try {
            const res = await fetch(`http://localhost:3000/instances`)
            const json = await res.json()
            setInstances(json)
        } catch (err) {
            console.error("Failed to fetch instances", err)
        }
    }

    const fetchClientes = async () => {
        setLoading(true)
        try {
            const baseUrl = `http://localhost:3000/users?page=${page}&limit=10&search=${search}`
            const url = instanceId ? `${baseUrl}&instanceId=${instanceId}` : baseUrl
            const res = await fetch(url)
            const json = await res.json()
            setClientes(json.data)
            setMeta(json.meta)
        } catch (err) {
            console.error("Failed to fetch clientes", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInstances()
    }, [])

    useEffect(() => {
        fetchClientes()
    }, [page, search, instanceId])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-background">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border/40 px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Clientes</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="flex flex-col gap-6 p-6">
                    {/* Header da Página */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                                Central de Clientes
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Gerencie todos os clientes capturados automaticamente pelo bot.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-all shadow-lg shadow-blue-500/10">
                                <Download className="w-4 h-4" />
                                Exportar CSV
                            </button>
                        </div>
                    </div>

                    {/* Filtros e Busca */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou telefone..."
                                className="w-full bg-muted/40 border border-border/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-muted-foreground/60 leading-normal"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <select
                                className="w-full bg-muted/40 border border-border/50 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer text-muted-foreground"
                                value={instanceId}
                                onChange={(e) => setInstanceId(e.target.value)}
                            >
                                <option value="">Todas as Instâncias</option>
                                {instances.map((inst) => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.name} ({inst.phone || "Sem número"})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-1 flex items-center gap-2">
                            <div className="flex-1 px-3 py-2 bg-muted/40 border border-border/50 rounded-lg text-xs flex items-center justify-between text-muted-foreground">
                                <span>Total: <b className="text-foreground ml-1">{meta.total}</b></span>
                                <div className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Container da Tabela */}
                    <div className="rounded-xl border border-border/40 bg-zinc-950/20 backdrop-blur-sm overflow-hidden">
                        <ClientesTable
                            clientes={clientes}
                            loading={loading}
                            onEdit={(cliente: any) => setSelectedCliente(cliente)}
                        />

                        {/* Paginação */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/5">
                            <span className="text-xs text-muted-foreground">
                                Página {meta.page} de {meta.totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || loading}
                                    className="px-3 py-1 text-xs border border-border/50 rounded hover:bg-muted/50 disabled:opacity-50 transition-colors"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                    disabled={page === meta.totalPages || loading}
                                    className="px-3 py-1 text-xs border border-border/50 rounded hover:bg-muted/50 disabled:opacity-50 transition-colors"
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {selectedCliente && (
                    <ClienteEditModal
                        cliente={selectedCliente}
                        onClose={() => setSelectedCliente(null)}
                        onUpdate={fetchClientes}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    )
}

"use client"

import { Edit2, Phone, Calendar, User, Database } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Cliente } from "@/types/models"

interface ClientesTableProps {
    clientes: Cliente[]
    loading: boolean
    onEdit: (cliente: Cliente) => void
}

export function ClientesTable({ clientes, loading, onEdit }: ClientesTableProps) {
    if (loading) {
        return (
            <div className="flex flex-col gap-3 p-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-muted/20 animate-pulse rounded-lg border border-border/20" />
                ))}
            </div>
        )
    }

    if (clientes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="p-4 bg-muted/20 rounded-full">
                    <Database className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-muted-foreground">Nenhum cliente encontrado</h3>
                    <p className="text-sm text-muted-foreground/60">Aguarde a primeira mensagem para capturar clientes.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-muted/30 border-b border-border/40">
                        <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Cliente</th>
                        <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Capturado por</th>
                        <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Dados Capturados</th>
                        <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Criado em</th>
                        <th className="px-6 py-3 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                    {clientes.map((cliente) => {
                        const metadata = typeof cliente.metadata === 'string'
                            ? JSON.parse(cliente.metadata)
                            : cliente.metadata || {};

                        return (
                            <tr key={cliente.id} className="group hover:bg-blue-600/[0.03] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold shadow-sm">
                                            {cliente.name ? cliente.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                                                {cliente.name || "Sem Nome"}
                                            </span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Phone className="w-3 h-3 text-muted-foreground/60" />
                                                <span className="text-[11px] font-mono text-muted-foreground">
                                                    {cliente.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-foreground">
                                            {cliente.instance?.name || "Instância Desconhecida"}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                            {cliente.instance?.phone || "---"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                                        {Object.entries(metadata).slice(0, 3).map(([key, value]: any) => (
                                            <div key={key} className="px-2 py-0.5 rounded bg-zinc-900 border border-border/50 flex items-center gap-1.5">
                                                <span className="text-[10px] text-muted-foreground/50 lowercase">{key}:</span>
                                                <span className="text-[10px] text-foreground/80 font-medium truncate max-w-[80px]">{value}</span>
                                            </div>
                                        ))}
                                        {Object.keys(metadata).length > 3 && (
                                            <span className="text-[10px] text-muted-foreground/40 self-center">
                                                +{Object.keys(metadata).length - 3} mais
                                            </span>
                                        )}
                                        {Object.keys(metadata).length === 0 && (
                                            <span className="text-[10px] text-muted-foreground/30 italic">Nenhum dado extra</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                                        <span className="text-xs">
                                            {format(new Date(cliente.createdAt), "dd/MM/yy HH:mm", { locale: ptBR })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onEdit(cliente)}
                                        className="p-2 rounded-md hover:bg-blue-600/10 text-muted-foreground hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/30"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

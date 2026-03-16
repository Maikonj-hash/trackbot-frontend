"use client"

import { Edit2, Phone, Calendar, User, Database, RefreshCw, Trash2, Activity } from "lucide-react"
import { clsx } from "clsx"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Cliente } from "@/types/models"

interface ClientesTableProps {
    clientes: Cliente[]
    loading: boolean
    selectedId?: string
    onEdit: (cliente: Cliente) => void
    onReset: (cliente: Cliente) => void
    onDelete: (cliente: Cliente) => void
}

export function ClientesTable({ clientes, loading, selectedId, onEdit, onReset, onDelete }: ClientesTableProps) {
    if (loading) {
        return (
            <div className="flex flex-col gap-3 p-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-muted/10 animate-pulse rounded border border-border/20" />
                ))}
            </div>
        )
    }

    if (clientes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="p-4 bg-muted/5 rounded border border-border/50">
                    <Database className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">// ZERO_CLIENTS_FOUND</h3>
                    <p className="text-[10px] text-muted-foreground/40 font-mono tracking-tighter lowercase">Aguarde a primeira mensagem para captura automática.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-muted/10 border-b border-border/30">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cliente_Identity</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Source_Node</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Data_Pool</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Created_At</th>
                        <th className="px-6 py-4 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                    {clientes.map((cliente) => {
                        let metadata: any = {};
                        try {
                            metadata = typeof cliente.metadata === 'string'
                                ? JSON.parse(cliente.metadata)
                                : cliente.metadata || {};
                        } catch (e) {
                            console.error("Failed to parse metadata for cliente", cliente.id, e);
                        }

                        return (
                            <tr
                                key={cliente.id}
                                className={clsx(
                                    "group transition-colors",
                                    selectedId === cliente.id ? "bg-blue-500/10 border-l-2 border-blue-500" : "hover:bg-foreground/[0.02]"
                                )}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded bg-muted/10 border border-border/30 flex items-center justify-center text-foreground font-bold shadow-sm text-xs font-mono">
                                            {cliente.name ? cliente.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-muted-foreground" />}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className={clsx(
                                                "text-xs font-bold tracking-tight uppercase transition-colors",
                                                (cliente.name === 'UNIDENTIFIED_USER' || !cliente.name) ? "text-muted-foreground/50 italic text-[10px]" : "text-foreground"
                                            )}>
                                                {cliente.name === 'UNIDENTIFIED_USER' ? 'Cadastro Pendente' : (cliente.name || "SEM NOME")}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3 h-3 text-blue-500/40" />
                                                <span className="text-[10px] font-mono tracking-tighter">
                                                    {metadata.whatsapp_real ? (
                                                        <span className="text-blue-400 font-bold flex items-center gap-1">
                                                            {metadata.whatsapp_real}
                                                            <Activity className="w-2.5 h-2.5 opacity-40 animate-pulse" />
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground/60">{cliente.phone.split('@')[0]}</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">
                                            {cliente.instance?.name || "ROOT_CORE"}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-mono opacity-60">
                                            {cliente.instance?.phone || "SYSTEM_FLOW"}
                                        </span>
                                    </div>
                                </td>
                                <td className={clsx("px-6 py-4", selectedId && "hidden lg:table-cell")}>
                                    <div className="flex flex-wrap gap-1 max-w-[320px]">
                                        {Object.entries(metadata)
                                            .filter(([key]) => key !== 'whatsapp_real')
                                            .slice(0, 3)
                                            .map(([key, value]: any) => (
                                                <div key={key} className="px-2 py-0.5 rounded bg-muted/5 border border-border/30 flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-muted-foreground/40 font-mono">.{key}</span>
                                                    <span className="text-[9px] text-foreground/70 font-mono truncate max-w-[90px]">{String(value)}</span>
                                                </div>
                                            ))}
                                        {Object.keys(metadata).length > 3 && (
                                            <span className="text-[9px] text-muted-foreground/30 font-mono self-center px-1">
                                                +{Object.keys(metadata).length - 3}_MORE
                                            </span>
                                        )}
                                        {Object.keys(metadata).length === 0 && (
                                            <span className="text-[9px] text-muted-foreground/20 font-mono tracking-tighter uppercase">// NO_DATA</span>
                                        )}
                                    </div>
                                </td>
                                <td className={clsx("px-6 py-4", selectedId && "hidden 2xl:table-cell")}>
                                    <div className="flex items-center gap-2 text-muted-foreground font-mono">
                                        <Calendar className="w-3 h-3 opacity-30" />
                                        <span className="text-[10px] tracking-tighter">
                                            {format(new Date(cliente.createdAt), "dd/MM/yy HH:mm", { locale: ptBR })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onReset(cliente)}
                                            className="p-1.5 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/20"
                                            title="Resetar Fluxo (Limpar Chat)"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(cliente)}
                                            className="p-1.5 rounded hover:bg-foreground hover:text-background text-muted-foreground transition-all border border-transparent hover:border-foreground/20"
                                            title="Editar Dados"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(cliente)}
                                            className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                            title="Deletar Cliente"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

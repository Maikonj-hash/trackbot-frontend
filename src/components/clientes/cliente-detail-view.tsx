"use client"

import { useState, useEffect } from "react"
import { Save, User, Brain, Tag, Trash2, History, ClipboardList, ChevronRight, ChevronDown, Activity, FileJson, LogIn, MousePointer2, Copy, Check, X } from "lucide-react"
import { API_URL } from "@/lib/constants"
import { Cliente, Ticket } from "@/types/models"
import { clsx } from "clsx"

interface ClienteDetailViewProps {
    cliente: Cliente
    onClose: () => void
    onUpdate: () => void
}

export function ClienteDetailView({ cliente, onClose, onUpdate }: ClienteDetailViewProps) {
    const [activeTab, setActiveTab] = useState<'data' | 'history' | 'journey'>('data')
    const [name, setName] = useState(cliente.name || "")
    const [metadata, setMetadata] = useState<any>(
        typeof cliente.metadata === 'string' ? JSON.parse(cliente.metadata) : cliente.metadata || {}
    )
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loadingTickets, setLoadingTickets] = useState(false)
    const [ticketError, setTicketError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // Reset local state when cliente changes
    useEffect(() => {
        setName(cliente.name || "")
        setMetadata(typeof cliente.metadata === 'string' ? JSON.parse(cliente.metadata) : cliente.metadata || {})
        setActiveTab('data')
        setExpandedTicketId(null)
    }, [cliente])

    const fetchTickets = async () => {
        setLoadingTickets(true)
        setTicketError(null)
        try {
            const res = await fetch(`${API_URL}/users/${cliente.id}/tickets`)
            if (res.ok) {
                const data = await res.json()
                setTickets(data)
            } else {
                setTicketError("Não foi possível carregar o histórico.")
            }
        } catch (err) {
            console.error("Failed to fetch tickets", err)
            setTicketError("Erro de conexão com o servidor.")
        } finally {
            setLoadingTickets(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'history' || activeTab === 'journey') {
            fetchTickets()
        }
    }, [activeTab, cliente.id])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch(`${API_URL}/users/${cliente.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, metadata })
            })

            if (res.ok) {
                onUpdate()
            }
        } catch (err) {
            console.error("Failed to update cliente", err)
        } finally {
            setSaving(false)
        }
    }

    const updateMetaValue = (key: string, value: string) => {
        setMetadata({ ...metadata, [key]: value })
    }

    const removeMeta = (key: string) => {
        const newMeta = { ...metadata }
        delete newMeta[key]
        setMetadata(newMeta)
    }

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-l border-border/20 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-border/10 flex items-center justify-between bg-muted/5">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight uppercase">
                            {cliente.name === 'UNIDENTIFIED_USER' ? 'Cadastro Pendente' : (cliente.name || 'Sem Nome')}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-muted-foreground opacity-60 uppercase tracking-tighter">
                                {metadata.whatsapp_real ? (
                                    <span className="text-blue-500 font-bold">WPP: {metadata.whatsapp_real}</span>
                                ) : (
                                    `ID: ${cliente.id.substring(0, 8)}...`
                                )}
                            </span>
                            <span className="text-[9px] font-mono text-muted-foreground opacity-30 uppercase tracking-tighter">
                                // {cliente.phone.split('@')[0]}
                            </span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 border-b border-border/10 sticky top-0 bg-background/50 backdrop-blur-md z-10 px-2">
                <button
                    onClick={() => setActiveTab('data')}
                    className={clsx(
                        "px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
                        activeTab === 'data' ? "border-blue-500 text-foreground bg-blue-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <span>Dados</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={clsx(
                        "px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
                        activeTab === 'history' ? "border-blue-500 text-foreground bg-blue-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <History className="w-3 h-3" />
                        <span>Histórico</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('journey')}
                    className={clsx(
                        "px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
                        activeTab === 'journey' ? "border-blue-500 text-foreground bg-blue-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        <span>Jornadas</span>
                    </div>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {/* Tab: Current Data */}
                {activeTab === 'data' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Campo Nome */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <Tag className="w-3 h-3 text-blue-500/60" />
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Identificação Principal</label>
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="NOME COMPLETO"
                                className="w-full bg-muted/20 border border-border/50 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:opacity-30"
                            />
                        </div>

                        {/* Metadados / Inteligência */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-3 h-3 text-emerald-500/60" />
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Memória de Curto Prazo</label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(metadata).map(([key, value]: any) => (
                                    <div key={key} className="flex items-center gap-3 p-3 bg-muted/5 border border-border/30 rounded-lg group hover:border-blue-500/30 transition-all">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest font-mono">[{key}]</span>
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => updateMetaValue(key, e.target.value)}
                                                className="bg-transparent text-sm font-mono focus:outline-none w-full border-b border-transparent focus:border-foreground/20 transition-all py-0.5"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeMeta(key)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {Object.keys(metadata).length === 0 && (
                                    <div className="text-center py-12 border border-dashed border-border/30 rounded-xl bg-muted/5">
                                        <Brain className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-50">// Zero registros em memória</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Button (Sticky relative to content) */}
                        <div className="pt-4 border-t border-border/10">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 rounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg"
                            >
                                {saving ? (
                                    <div className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-3.5 h-3.5" />
                                )}
                                SALVAR ALTERAÇÕES
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab Content: History */}
                {activeTab === 'history' && (
                    <div className="flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {loadingTickets ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                <span className="text-[10px] font-mono text-muted-foreground uppercase animate-pulse">Lendo Histórico...</span>
                            </div>
                        ) : ticketError ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                                <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest">{ticketError}</p>
                                <button
                                    onClick={fetchTickets}
                                    className="mt-4 px-4 py-2 text-[10px] font-bold border border-border/50 rounded uppercase hover:bg-muted/50 transition-all tracking-widest"
                                >
                                    RECARREGAR
                                </button>
                            </div>
                        ) : tickets.length > 0 ? (
                            <div className="space-y-2 pb-10">
                                {tickets.map((ticket) => (
                                    <div key={ticket.id} className="border border-border/50 rounded-lg overflow-hidden bg-muted/5 group hover:border-blue-500/30 transition-all">
                                        <button
                                            onClick={() => setExpandedTicketId(expandedTicketId === ticket.id ? null : ticket.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 text-[8px] font-mono">
                                                    {tickets.indexOf(ticket) + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-foreground/90 uppercase truncate max-w-[120px]">
                                                        {ticket.protocol || "S/ PROTOCOLO"}
                                                    </span>
                                                    <span className="text-[8px] text-muted-foreground font-mono uppercase opacity-70">
                                                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="px-1.5 py-0.5 rounded border border-blue-500/10 bg-blue-500/5 text-[7px] font-bold text-blue-500 uppercase">
                                                    {ticket.flowName?.substring(0, 10) || "Geral"}
                                                </div>
                                                {expandedTicketId === ticket.id ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                                            </div>
                                        </button>
                                        
                                        {expandedTicketId === ticket.id && (
                                            <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-2 duration-200">
                                                <div className="p-3 bg-muted/10 rounded-lg border border-border/20 space-y-3">
                                                    <div className="flex items-center gap-2 opacity-60">
                                                        <ClipboardList className="w-2.5 h-2.5" />
                                                        <span className="text-[8px] font-bold uppercase tracking-widest">Snapshot</span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {Object.entries(ticket.content.customer?.metadata || {}).map(([key, val]: any) => (
                                                            <div key={key} className="flex flex-col border-l border-blue-500/20 pl-2">
                                                                <span className="text-[7px] font-bold text-muted-foreground/50 uppercase">{key}</span>
                                                                <span className="text-[9px] font-mono text-foreground/80 break-words">{String(val)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/30 rounded-xl bg-muted/5">
                                <History className="w-8 h-8 text-muted-foreground/10 mb-2" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Sem registros</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content: Journey */}
                {activeTab === 'journey' && (
                    <div className="flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {loadingTickets ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
                                <Activity className="w-6 h-6 text-blue-500/30 animate-pulse" />
                                <span className="text-[10px] font-mono text-muted-foreground uppercase animate-pulse">Lendo jornadas...</span>
                            </div>
                        ) : tickets.length > 0 ? (
                            <div className="space-y-4 pb-10">
                                {tickets.map((ticket) => (
                                    <div key={ticket.id} className="border border-border/50 rounded-lg overflow-hidden bg-muted/5">
                                        <div className="p-3 bg-muted/10 border-b border-border/30 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                <span className="text-[9px] font-bold uppercase">{ticket.protocol || "Sessão"}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(JSON.stringify(ticket.content, null, 2))
                                                    setCopiedId(ticket.id)
                                                    setTimeout(() => setCopiedId(null), 2000)
                                                }}
                                                className="p-1 hover:bg-muted rounded transition-colors"
                                            >
                                                {copiedId === ticket.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                                            </button>
                                        </div>

                                        <div className="p-4 space-y-6">
                                            {/* Timeline Visual */}
                                            <div className="relative pl-4 space-y-6 border-l border-border/50 ml-2">
                                                {(ticket.content.journey || []).map((event, i) => (
                                                    <div key={i} className="relative">
                                                        <div className={clsx(
                                                            "absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 border-background flex items-center justify-center",
                                                            event.type === 'ENTRY' ? "bg-blue-500" : "bg-emerald-500"
                                                        )}>
                                                            {event.type === 'ENTRY' ? <LogIn className="w-1.5 h-1.5 text-white" /> : <MousePointer2 className="w-1.5 h-1.5 text-white" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold uppercase tracking-tight leading-tight">
                                                                {event.type === 'ENTRY' ? `${event.label || event.nodeId}` : `${event.value}`}
                                                            </span>
                                                            <span className="text-[7px] font-mono text-muted-foreground/60 uppercase">
                                                                {event.nodeType} // {new Date(event.timestamp).toLocaleTimeString('pt-BR')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Mini JSON View */}
                                            <details className="group">
                                                <summary className="text-[8px] font-bold uppercase tracking-widest text-orange-500 cursor-pointer hover:opacity-80 list-none flex items-center gap-1">
                                                    <ChevronRight className="w-2.5 h-2.5 group-open:rotate-90 transition-transform" />
                                                    Ver Payload Bruto
                                                </summary>
                                                <div className="mt-2 p-3 bg-black rounded border border-orange-500/20 overflow-x-auto shadow-inner">
                                                    <pre className="text-[8px] font-mono text-orange-200/80 leading-tight">
                                                        {JSON.stringify(ticket.content, null, 2)}
                                                    </pre>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/30 rounded-xl bg-muted/5">
                                <Activity className="w-8 h-8 text-muted-foreground/10 mb-2" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Sem jornadas</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

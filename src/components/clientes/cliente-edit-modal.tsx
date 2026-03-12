"use client"

import { useState, useEffect } from "react"
import { Save, User, Brain, Tag, Trash2, History, ClipboardList, ChevronRight, ChevronDown } from "lucide-react"
import { API_URL } from "@/lib/constants"
import { Cliente } from "@/types/models"
import { StandardModal } from "@/components/ui/standard-modal"
import { clsx } from "clsx"

interface ClienteEditModalProps {
    cliente: Cliente
    onClose: () => void
    onUpdate: () => void
}

export function ClienteEditModal({ cliente, onClose, onUpdate }: ClienteEditModalProps) {
    const [activeTab, setActiveTab] = useState<'data' | 'history'>('data')
    const [name, setName] = useState(cliente.name || "")
    const [metadata, setMetadata] = useState<any>(
        typeof cliente.metadata === 'string' ? JSON.parse(cliente.metadata) : cliente.metadata || {}
    )
    const [tickets, setTickets] = useState<any[]>([])
    const [loadingTickets, setLoadingTickets] = useState(false)
    const [ticketError, setTicketError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null)

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
        if (activeTab === 'history') {
            fetchTickets()
        }
    }, [activeTab])

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
                onClose()
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
        <StandardModal
            isOpen={true}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">FICHA DO CLIENTE</span>
                        <span className="text-[9px] font-mono text-muted-foreground opacity-60 uppercase tracking-tighter">ID: {cliente.id} // Tel: {cliente.phone}</span>
                    </div>
                </div>
            }
            size="lg"
            footer={
                activeTab === 'data' ? (
                    <div className="flex items-center justify-end gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-muted/50 rounded border border-border/50 transition-colors"
                        >
                            CANCELAR
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 rounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg"
                        >
                            {saving ? (
                                <div className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            SALVAR ALTERAÇÕES
                        </button>
                    </div>
                ) : null
            }
        >
            <div className="flex flex-col h-full min-h-[500px]">
                {/* Tabs Navigation */}
                <div className="flex items-center gap-1 border-b border-border/30 mb-6 sticky top-0 bg-background/50 backdrop-blur-sm z-10">
                    <button
                        onClick={() => setActiveTab('data')}
                        className={clsx(
                            "px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
                            activeTab === 'data' ? "border-blue-500 text-foreground bg-blue-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Tag className="w-3 h-3" />
                            <span>Dados Atuais</span>
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
                            <span>Histórico de Chamados</span>
                        </div>
                    </button>
                </div>

                {/* Tab Content: Current Data */}
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
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Memória de Curto Prazo (Metadata)</label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
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
                    </div>
                )}

                {/* Tab Content: History */}
                {activeTab === 'history' && (
                    <div className="flex-1 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {loadingTickets ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                <span className="text-[10px] font-mono text-muted-foreground uppercase animate-pulse">Consultando Arquivos...</span>
                            </div>
                        ) : ticketError ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                                <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest">{ticketError}</p>
                                <button
                                    onClick={fetchTickets}
                                    className="mt-4 px-4 py-2 text-[10px] font-bold border border-border/50 rounded uppercase hover:bg-muted/50 transition-all tracking-widest"
                                >
                                    TENTAR NOVAMENTE
                                </button>
                            </div>
                        ) : tickets.length > 0 ? (
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-10">
                                {tickets.map((ticket) => (
                                    <div key={ticket.id} className="border border-border/50 rounded-lg overflow-hidden bg-muted/5 group hover:border-blue-500/30 transition-all">
                                        <button
                                            onClick={() => setExpandedTicketId(expandedTicketId === ticket.id ? null : ticket.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all font-mono text-blue-500 text-[10px]">
                                                    {tickets.indexOf(ticket) + 1}
                                                </div>
                                                <div className="flex flex-col items-start translate-y-[-1px]">
                                                    <span className="text-[11px] font-bold text-foreground/90 uppercase truncate max-w-[150px]">
                                                        {ticket.protocol || "SEM PROTOCOLO"}
                                                    </span>
                                                    <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter opacity-70">
                                                        {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/5 text-[8px] font-bold text-blue-500 uppercase tracking-tighter">
                                                    {ticket.flowName || "Fluxo Geral"}
                                                </div>
                                                {expandedTicketId === ticket.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                                            </div>
                                        </button>
                                        
                                        {expandedTicketId === ticket.id && (
                                            <div className="px-4 pb-4 pt-1 animate-in slide-in-from-top-2 duration-200">
                                                <div className="p-4 bg-muted/10 rounded-lg border border-border/30 space-y-4">
                                                    <div className="flex items-center gap-2 opacity-60">
                                                        <ClipboardList className="w-3 h-3" />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest">Snapshot Capturado</span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {Object.entries(ticket.content.customer?.metadata || {}).map(([key, val]: any) => (
                                                            <div key={key} className="flex flex-col gap-0.5 border-l-2 border-blue-500/20 pl-3">
                                                                <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-tighter">{key}</span>
                                                                <span className="text-[11px] font-mono text-foreground/80 break-words">{String(val)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {(!ticket.content.customer?.metadata || Object.keys(ticket.content.customer.metadata).length === 0) && (
                                                        <p className="text-[10px] text-muted-foreground italic opacity-50">Nenhum metadado capturado neste atendimento.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/30 rounded-2xl bg-muted/5 mx-4">
                                <History className="w-12 h-12 text-muted-foreground/10 mb-4" />
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Nada para Ver</h4>
                                <p className="text-[10px] text-muted-foreground/60 max-w-[200px] leading-relaxed">
                                    Este cliente ainda não finalizou nenhum fluxo com o robô.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </StandardModal>
    )
}

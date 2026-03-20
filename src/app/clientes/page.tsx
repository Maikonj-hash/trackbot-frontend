"use client"

import { useState, useEffect } from "react"
import { Search, Download } from "lucide-react"
import { clsx } from "clsx"
import { ClientesTable } from "@/components/clientes/clientes-table"
import { ClienteDetailView } from "@/components/clientes/cliente-detail-view"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { api } from "@/lib/api-client"
import { Cliente, Instance, PaginationMeta } from "@/types/models"

export default function ClientesPage() {
    const [search, setSearch] = useState("")
    const [instanceId, setInstanceId] = useState("")
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [instances, setInstances] = useState<Instance[]>([])
    const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
    const [page, setPage] = useState(1)

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        variant: "info" | "warning" | "danger";
        onConfirm: () => void;
        isLoading: boolean;
    }>({
        isOpen: false,
        title: "",
        description: "",
        variant: "info",
        onConfirm: () => { },
        isLoading: false
    });

    const fetchInstances = async () => {
        try {
            const res = await api.get("/instances")
            const json = await res.json()
            setInstances(json)
        } catch (err) {
            console.error("Failed to fetch instances", err)
        }
    }

    const fetchClientes = async () => {
        setLoading(true)
        try {
            const baseUrl = `/users?page=${page}&limit=10&search=${search}`
            const url = instanceId ? `${baseUrl}&instanceId=${instanceId}` : baseUrl
            const res = await api.get(url)
            const json = await res.json()
            setClientes(json.data)
            setMeta(json.meta)

            if (selectedCliente) {
                const updated = json.data.find((c: Cliente) => c.id === selectedCliente.id);
                if (updated) setSelectedCliente(updated);
            }
        } catch (err) {
            console.error("Failed to fetch clientes", err)
        } finally {
            setLoading(false)
        }
    }

    const handleResetFlow = (cliente: Cliente) => {
        setConfirmModal({
            isOpen: true,
            title: "Resetar Fluxo",
            description: `Deseja realmente resetar o fluxo de *${cliente.name || cliente.phone}*?\n\nO robô esquecerá o passo atual e recomeçará o atendimento na próxima mensagem.`,
            variant: "warning",
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }));
                try {
                    const res = await api.post(`/users/${cliente.id}/reset`);
                    if (!res.ok) throw new Error("Erro ao resetar");
                    fetchClientes();
                } catch (err) {
                    console.error(err);
                } finally {
                    setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
                }
            }
        });
    };

    const handleDeleteCliente = (cliente: Cliente) => {
        setConfirmModal({
            isOpen: true,
            title: "Deletar Cliente",
            description: `Ação CRÍTICA: Deseja apagar permanentemente o cliente *${cliente.name || cliente.phone}*?\n\nIsso removerá todos os dados do banco e resetará o chat dele.`,
            variant: "danger",
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }));
                try {
                    const res = await api.delete(`/users/${cliente.id}`);
                    if (!res.ok) throw new Error("Erro ao deletar");
                    if (selectedCliente?.id === cliente.id) setSelectedCliente(null);
                    fetchClientes();
                } catch (err) {
                    console.error(err);
                } finally {
                    setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
                }
            }
        });
    };

    useEffect(() => {
        fetchInstances()
    }, [])

    useEffect(() => {
        fetchClientes()
    }, [page, search, instanceId])

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <main className={clsx(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                selectedCliente ? "max-w-[50%]" : "max-w-full"
            )}>
                <div className="flex-1 flex flex-col p-8 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border/10 flex-shrink-0">
                        <div className="flex items-center">
                            <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-4 flex-shrink-0" />
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                                    Central de Clientes
                                </h1>
                                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter opacity-70">
                                    // Gerenciamento de Identificação e Rastreabilidade
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <button className="flex items-center gap-2 px-5 py-2 bg-foreground text-background hover:bg-foreground/90 rounded text-[10px] font-bold uppercase tracking-widest transition-all">
                                <Download className="w-3.5 h-3.5" />
                                Exportar CSV
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-6 min-h-0">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="BUSCAR POR NOME OU TELEFONE..."
                                    className="w-full bg-muted/5 border border-border/50 rounded py-2 pl-10 pr-4 text-[11px] font-mono focus:outline-none focus:border-foreground/30 transition-all placeholder:text-muted-foreground/40 leading-normal"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <select
                                    className="w-full bg-muted/5 border border-border/50 rounded py-2 px-3 text-[11px] font-mono focus:outline-none focus:border-foreground/30 transition-all appearance-none cursor-pointer text-muted-foreground uppercase"
                                    value={instanceId}
                                    onChange={(e) => setInstanceId(e.target.value)}
                                >
                                    <option value="">TODA AS INSTÂNCIAS</option>
                                    {instances.map((inst) => (
                                        <option key={inst.id} value={inst.id}>
                                            {inst.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <div className="h-full px-4 py-2 bg-muted/5 border border-border/30 rounded text-[10px] flex items-center justify-between text-muted-foreground font-mono">
                                    <span className="uppercase tracking-widest">Total:</span>
                                    <span className="text-foreground font-bold">{meta.total.toString().padStart(4, '0')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col rounded border border-border/40 bg-muted/5 overflow-hidden shadow-inner min-h-0">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <ClientesTable
                                    clientes={clientes}
                                    loading={loading}
                                    selectedId={selectedCliente?.id}
                                    onEdit={(cliente: Cliente) => setSelectedCliente(cliente)}
                                    onReset={handleResetFlow}
                                    onDelete={handleDeleteCliente}
                                />
                            </div>

                            <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-black/20">
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                    PAGE_{meta.page.toString().padStart(2, '0')}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1 || loading}
                                        className="px-4 py-1.5 text-[10px] font-bold border border-border/50 rounded uppercase hover:bg-muted/50 disabled:opacity-30 transition-all tracking-widest"
                                    >
                                        BACK
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                        disabled={page === meta.totalPages || loading}
                                        className="px-4 py-1.5 text-[10px] font-bold border border-border/50 rounded uppercase hover:bg-muted/50 disabled:opacity-30 transition-all tracking-widest"
                                    >
                                        NEXT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {selectedCliente && (
                <aside className="w-[50%] flex flex-col border-l border-border/20 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] z-20 overflow-hidden relative">
                    <ClienteDetailView
                        cliente={selectedCliente}
                        onClose={() => setSelectedCliente(null)}
                        onUpdate={fetchClientes}
                    />
                </aside>
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                variant={confirmModal.variant}
                isLoading={confirmModal.isLoading}
            />
        </div>
    )
}


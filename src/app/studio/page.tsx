"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MessageSquareShare, Loader2, Calendar, Bot } from "lucide-react";
import { API_URL } from "@/lib/constants";
import { Flow } from "@/types/models";

import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { InputModal } from "@/components/ui/input-modal";

import { Button } from "@/components/ui/button";

export default function FlowsPage() {
    const [flows, setFlows] = useState<Flow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
        isOpen: false,
        id: "",
        name: ""
    });
    const router = useRouter();

    const fetchFlows = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/flows`);
            if (res.ok) {
                const data = await res.json();
                setFlows(data);
            }
        } catch (error) {
            console.error("Erro ao buscar fluxos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFlows();
    }, []);

    const handleCreateNew = async (name: string) => {
        try {
            setIsCreating(true);
            const res = await fetch(`${API_URL}/flows`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description: "Criado pelo Flow Studio",
                    jsonContent: { nodes: [], edges: [] }
                }),
            });
            if (res.ok) {
                const newFlow = await res.json();
                router.push(`/studio/editor?id=${newFlow.id}`);
            }
        } catch (error) {
            console.error("Erro ao criar fluxo:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDuplicate = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${API_URL}/flows/${id}/duplicate`, { method: "POST" });
            if (res.ok) fetchFlows();
        } catch (error) {
            console.error("Erro ao duplicar:", error);
        }
    };

    const handleToggleActive = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${API_URL}/flows/${id}/toggle`, { method: "PATCH" });
            if (res.ok) {
                setFlows(flows.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
            }
        } catch (error) {
            console.error("Erro ao alternar status:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_URL}/flows/${deleteModal.id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setFlows(flows.filter(f => f.id !== deleteModal.id));
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    return (
        <div className="flex-1 p-8 space-y-8 bg-background w-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-4 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Flow Studio</h1>
                        <p className="text-sm text-muted-foreground mt-1">Crie, gerencie e publique suas automações de WhatsApp.</p>
                    </div>
                </div>

                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    isLoading={isCreating}
                    size="icon"
                    title="Novo Fluxo"
                >
                    {!isCreating && <Plus className="w-4 h-4" />}
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : flows.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/60 rounded-xl bg-card/30">
                    <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-4">
                        <MessageSquareShare className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Nenhum fluxo encontrado</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Você ainda não criou nenhuma automação. Clique no botão acima para construir seu primeiro chatbot.
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={isCreating}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md shadow-sm transition-colors"
                    >
                        Criar meu primeiro fluxo
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {flows.map((flow) => (
                        <div
                            key={flow.id}
                            onClick={() => router.push(`/studio/editor?id=${flow.id}`)}
                            className={`group flex flex-col justify-between bg-card text-card-foreground border rounded-xl shadow-sm hover:shadow-md hover:border-blue-600/50 hover:ring-1 hover:ring-blue-600/20 transition-all cursor-pointer overflow-hidden p-5 min-h-[180px] ${!flow.isActive ? 'opacity-70 border-dashed bg-card/50' : 'border-border/50'}`}
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${flow.isActive ? 'bg-blue-600/10 text-blue-600' : 'bg-muted text-muted-foreground'}`}>
                                        <MessageSquareShare className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDuplicate(e, flow.id)}
                                            title="Duplicar Fluxo"
                                            className="text-muted-foreground hover:text-blue-600 p-1.5 bg-background rounded-md shadow-sm border border-border/50 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                        </button>
                                        <button
                                            onClick={(e) => handleToggleActive(e, flow.id)}
                                            title={flow.isActive ? "Desativar" : "Ativar"}
                                            className={`p-1.5 bg-background rounded-md shadow-sm border border-border/50 transition-colors ${flow.isActive ? 'text-emerald-500 hover:text-muted-foreground' : 'text-muted-foreground hover:text-emerald-500'}`}
                                        >
                                            <Bot className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteModal({ isOpen: true, id: flow.id, name: flow.name });
                                            }}
                                            title="Excluir"
                                            className="text-muted-foreground hover:text-red-500 p-1.5 bg-background rounded-md shadow-sm border border-border/50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base line-clamp-1">{flow.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                        {flow.description || "Sem descrição."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{new Date(flow.updatedAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter border ${flow.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border/50'}`}>
                                    {flow.isActive ? 'Ativo' : 'Off'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modais de Gerenciamento */}
            <InputModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateNew}
                title="Novo Fluxo"
                description="Dê um nome para sua nova automação."
                label="Nome do Fluxo"
                placeholder="Ex: Checkout de Vendas"
                confirmText="Criar e Editar"
                isLoading={isCreating}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleDelete}
                variant="danger"
                title="Apagar Fluxo"
                description={`Você tem certeza que deseja excluir o fluxo "${deleteModal.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir Fluxo"
            />
        </div>
    );
}

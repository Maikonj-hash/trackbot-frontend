"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MessageSquareShare, Loader2, Calendar } from "lucide-react";
import { API_URL } from "@/lib/constants";

interface FlowRecord {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { InputModal } from "@/components/ui/input-modal";

export default function FlowsPage() {
    const [flows, setFlows] = useState<FlowRecord[]>([]);
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
        <div className="flex-1 p-2 space-y-8 bg-background max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Flow Studio</h2>
                    <p className="text-muted-foreground mt-1">Crie, gerencie e publique suas automações de WhatsApp.</p>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    disabled={isCreating}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-50"
                >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Criar Novo Fluxo
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : flows.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/60 rounded-xl bg-card/30">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                        <MessageSquareShare className="w-8 h-8 text-emerald-500" />
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
                            className="group flex flex-col justify-between bg-card text-card-foreground border border-border/50 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/50 hover:ring-1 hover:ring-emerald-500/20 transition-all cursor-pointer overflow-hidden p-5 min-h-[160px]"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <MessageSquareShare className="w-5 h-5" />
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteModal({ isOpen: true, id: flow.id, name: flow.name });
                                        }}
                                        className="text-muted-foreground hover:text-red-500 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded-md shadow-sm border border-border/50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="font-semibold text-base line-clamp-1">{flow.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {flow.description || "Sem descrição."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Atualizado em {new Date(flow.updatedAt).toLocaleDateString('pt-BR')}</span>
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

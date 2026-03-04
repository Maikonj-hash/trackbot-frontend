"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Smartphone, RefreshCw, Loader2, Info } from "lucide-react";
import { API_URL } from "@/lib/constants";
import { InstanceCard } from "@/components/studio/instances/instance-card";
import { QRModal } from "@/components/studio/instances/qr-modal";
import { clsx } from "clsx";

import { InputModal } from "@/components/ui/input-modal";

export default function InstancesPage() {
    const [instances, setInstances] = useState<any[]>([]);
    const [flows, setFlows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // QR Modal State
    const [pairModal, setPairModal] = useState<{ isOpen: boolean; id: string; name: string }>({
        isOpen: false,
        id: "",
        name: ""
    });

    const fetchData = useCallback(async () => {
        // Não busca se a página estiver em background para economizar recursos e evitar erros de rede vãos
        if (typeof document !== "undefined" && document.visibilityState !== "visible") return;

        try {
            const [instRes, flowRes] = await Promise.all([
                fetch(`${API_URL}/instances`),
                fetch(`${API_URL}/flows`)
            ]);

            if (instRes.ok && flowRes.ok) {
                const [instData, flowData] = await Promise.all([instRes.json(), flowRes.json()]);
                setInstances(instData);
                setFlows(flowData);
            }
        } catch (error) {
            // Silencia erros de "Failed to fetch" (servidor offline temporariamente)
            console.warn("Servidor indisponível no momento. Tentando novamente em breve...");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleClosePairModal = useCallback(() => {
        setPairModal(prev => ({ ...prev, isOpen: false }));
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
        // Polling suave para manter status sincronizado sems sockets globais no momento
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleCreateInstance = async (name: string) => {
        try {
            setIsCreating(true);
            const res = await fetch(`${API_URL}/instances`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });

            if (res.ok) {
                const newInst = await res.json();
                await fetchData();
                // Abre o modal de pareamento automaticamente para a nova instância
                setPairModal({ isOpen: true, id: newInst.id, name: newInst.name });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* Header Section */}
                <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">Meus Aparelhos</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Info className="w-3.5 h-3.5" />
                            Conecte seus números do WhatsApp e vincule-os aos fluxos automatizados.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            className="p-2 rounded-md border border-border/50 hover:bg-muted transition-colors text-muted-foreground"
                            title="Atualizar Lista"
                        >
                            <RefreshCw className={clsx("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            disabled={isCreating}
                            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:opacity-90 transition-all active:scale-95 uppercase tracking-wider disabled:opacity-50"
                        >
                            {isCreating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            NOVO APARELHO
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-6xl mx-auto">
                    {isLoading && instances.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30" />
                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Carregando Instâncias...</span>
                        </div>
                    ) : instances.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {instances.map(instance => (
                                <InstanceCard
                                    key={instance.id}
                                    instance={instance}
                                    flows={flows}
                                    onPair={(id, name) => setPairModal({ isOpen: true, id, name })}
                                    onRefresh={fetchData}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 px-8 border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                                <Smartphone className="w-8 h-8 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Nenhum aparelho conectado</h3>
                            <p className="text-muted-foreground text-sm max-w-sm text-center mb-8">
                                Você ainda não adicionou nenhum número de WhatsApp. Clique no botão acima para começar.
                            </p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 border border-border hover:bg-muted px-6 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                                ADICIONAR PRIMEIRO CHIP
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Criar Aparelho */}
            <InputModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateInstance}
                title="Novo Aparelho"
                description="Dê um nome para identificar este chip no sistema."
                label="Nome do Aparelho"
                placeholder="Ex: Suporte Vendas"
                confirmText="Criar Instância"
                isLoading={isCreating}
            />

            {/* Modal de Pareamento QR */}
            <QRModal
                isOpen={pairModal.isOpen}
                instanceId={pairModal.id}
                instanceName={pairModal.name}
                onClose={handleClosePairModal}
            />
        </>
    );
}

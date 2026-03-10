"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Smartphone, RefreshCw, Loader2, Info } from "lucide-react";
import { API_URL } from "@/lib/constants";
import { InstanceCard } from "@/components/studio/instances/instance-card";
import { QRModal } from "@/components/studio/instances/qr-modal";
import { InstanceModal } from "@/components/studio/instances/instance-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Instance, Flow } from "@/types/models";

export default function InstancesPage() {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [flows, setFlows] = useState<Flow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [pairModal, setPairModal] = useState<{ isOpen: boolean; id: string; name: string }>({
        isOpen: false,
        id: "",
        name: ""
    });

    const fetchData = useCallback(async () => {
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
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleCreateInstance = async (payload: Partial<Instance>) => {
        try {
            setIsCreating(true);
            const res = await fetch(`${API_URL}/instances`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const newInst = await res.json();
                await fetchData();

                if (payload.provider === "BAILEYS") {
                    setPairModal({ isOpen: true, id: newInst.id, name: newInst.name });
                }
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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-4 flex-shrink-0" />
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus Aparelhos</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 text-blue-600" />
                                Conecte seus números do WhatsApp e vincule-os aos fluxos automatizados.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchData}
                            isLoading={isLoading && instances.length > 0}
                            title="Atualizar Lista"
                        >
                            <RefreshCw className={cn("w-4 h-4", isLoading && instances.length > 0 && "animate-spin")} />
                        </Button>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            isLoading={isCreating}
                            size="icon"
                            title="Novo Aparelho"
                        >
                            {!isCreating && <Plus className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="w-full">
                    {isLoading && instances.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30" />
                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Carregando Instâncias...</span>
                        </div>
                    ) : instances.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                variant="outline"
                                className="font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                ADICIONAR PRIMEIRO CHIP
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Criar Aparelho Híbrido */}
            <InstanceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateInstance}
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

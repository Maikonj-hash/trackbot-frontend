import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Play, CheckCircle2, ArrowLeft, CloudIcon, Rocket } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import { useSimulator } from "@/hooks/use-simulator";
import { parseReactFlowToBackend, validateFlow } from "@/lib/flow-parser";
import { API_URL } from "@/lib/constants";
import { clsx } from "clsx";

import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function StudioTopbar() {
    const router = useRouter();
    const { nodes, edges, flowId, flowName, setFlowMetadata, setFlowName, isDirty, setSaved } = useFlowStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        variant: "info" | "warning" | "danger";
        onConfirm: () => void;
        confirmText?: string;
        showCancel?: boolean;
    }>({
        isOpen: false,
        title: "",
        description: "",
        variant: "info",
        onConfirm: () => { },
    });

    const showAlert = (title: string, description: string, variant: "info" | "warning" | "danger" = "info") => {
        setModal({
            isOpen: true,
            title,
            description,
            variant,
            onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
            confirmText: "Entendido",
            showCancel: false
        });
    };

    const handleSave = useCallback(async () => {
        if (!isDirty && flowId) return;

        try {
            setIsSaving(true);

            const backendPayload = parseReactFlowToBackend(nodes, edges, flowName);

            const isUpdate = !!flowId;
            const url = isUpdate ? `${API_URL}/flows/${flowId}` : `${API_URL}/flows`;

            const response = await fetch(url, {
                method: isUpdate ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: flowName,
                    description: "Gerado pelo TrackBot Studio Web",
                    jsonContent: {
                        nodes: nodes,
                        edges: edges,
                        backendFlow: backendPayload
                    }
                })
            });

            if (!response.ok) throw new Error("Falha ao salvar no banco");

            const data = await response.json();

            if (!isUpdate && data.id) {
                setFlowMetadata(data.id, data.name, data.description || "");
            }

            setSaved();
            setLastSaved(new Date());

        } catch (error) {
            console.error(error);
            showAlert("Erro ao Salvar", "Não foi possível sincronizar as alterações com o servidor.", "danger");
        } finally {
            setIsSaving(false);
        }
    }, [nodes, edges, flowId, flowName, isDirty, setFlowMetadata, setSaved]);

    const handlePublish = async () => {
        if (!flowId) return;

        const validation = validateFlow(nodes, edges);

        if (!validation.isValid) {
            showAlert("Fluxo Inválido", `Existem erros que impedem a publicação:\n\n- ${validation.errors.join('\n- ')}`, "danger");
            return;
        }

        const executePublish = async () => {
            try {
                setIsPublishing(true);
                await handleSave();
                const response = await fetch(`${API_URL}/flows/${flowId}/publish`, {
                    method: "POST",
                });

                if (!response.ok) throw new Error("Falha ao publicar fluxo");

                showAlert("Sucesso!", "Fluxo publicado com sucesso! O bot já está usando a nova versão.", "info");
            } catch (error) {
                console.error(error);
                showAlert("Erro ao Publicar", (error instanceof Error ? error.message : "Erro desconhecido"), "danger");
            } finally {
                setIsPublishing(false);
            }
        };

        if (validation.warnings.length > 0) {
            setModal({
                isOpen: true,
                title: "Avisos de Publicação",
                description: `Existem avisos no seu fluxo:\n\n- ${validation.warnings.join('\n- ')}\n\nDeseja publicar mesmo assim?`,
                variant: "warning",
                onConfirm: executePublish,
                confirmText: "Publicar Mesmo Assim",
                showCancel: true
            });
        } else {
            executePublish();
        }
    };

    useEffect(() => {
        if (isDirty && flowId) {
            const timer = setTimeout(() => {
                handleSave();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isDirty, flowId, handleSave]);

    return (
        <header className="h-14 bg-background border-b border-border/50 flex items-center justify-between px-6 z-20 shadow-sm relative font-sans">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/studio')}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors mr-2 border border-transparent hover:border-border"
                    title="Voltar para Meus Fluxos"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => {
                        const { toggleSimulator, isOpen, startSimulation } = useSimulator.getState();
                        toggleSimulator();
                        if (!isOpen) {
                            startSimulation(useFlowStore.getState().nodes, useFlowStore.getState().edges);
                        }
                    }}
                    className={clsx(
                        "w-8 h-8 rounded-md flex items-center justify-center transition-all hover:scale-105 active:scale-95",
                        useSimulator().isOpen ? "bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "bg-blue-600/20 hover:bg-blue-600/30"
                    )}
                    title={useSimulator().isOpen ? "Fechar Sandox" : "Testar no Simulador"}
                >
                    <Play className={clsx("w-4 h-4", useSimulator().isOpen ? "text-red-500 fill-red-500" : "text-blue-600 fill-blue-600")} />
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={flowName}
                            onChange={(e) => setFlowName(e.target.value)}
                            className="bg-transparent border-none text-sm font-semibold tracking-tight text-foreground focus:outline-none focus:ring-0 p-0 hover:bg-muted/50 rounded px-1 -mx-1 transition-colors w-64"
                            placeholder="Nome do Fluxo..."
                        />
                        {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Alterações não salvas" />}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground leading-none mt-1 uppercase font-mono tracking-tighter">
                        <span>{nodes.length} BLOCKS</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <CloudIcon className={clsx("w-3 h-3", isSaving ? "animate-pulse text-blue-500" : "text-muted-foreground/40")} />
                            {isSaving ? "SAVING..." : lastSaved ? `SAVED AT ${lastSaved.toLocaleTimeString()}` : "NOT SAVED YET"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="h-6 w-[1px] bg-border/60 mx-2" />

                <button
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all border",
                        isDirty
                            ? "bg-muted hover:bg-muted/80 text-foreground border-border shadow-sm"
                            : "bg-transparent text-muted-foreground border-transparent cursor-default"
                    )}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> SALVANDO...
                        </>
                    ) : (
                        <>
                            <Save className="w-3.5 h-3.5" /> {isDirty ? "SALVAR RASCUNHO" : "RASCUNHO ATUALIZADO"}
                        </>
                    )}
                </button>

                <button
                    onClick={handlePublish}
                    disabled={isPublishing || !flowId}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-all shadow-[0_2px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_15px_rgba(37,99,235,0.4)] disabled:opacity-50 active:scale-95 uppercase tracking-wider"
                >
                    {isPublishing ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> PUBLICANDO...
                        </>
                    ) : (
                        <>
                            <Rocket className="w-3.5 h-3.5" /> Publicar Fluxo
                        </>
                    )}
                </button>
            </div>

            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={modal.onConfirm}
                title={modal.title}
                description={modal.description}
                variant={modal.variant}
                confirmText={modal.confirmText}
                showCancel={modal.showCancel}
                isLoading={isPublishing}
            />
        </header>
    );
}

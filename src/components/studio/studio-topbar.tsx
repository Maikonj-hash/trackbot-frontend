import { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Save, 
    Loader2, 
    Play, 
    ArrowLeft, 
    CloudIcon, 
    Rocket, 
    Braces
} from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import { useSimulator } from "@/hooks/use-simulator";
import { parseReactFlowToBackend, validateFlow } from "@/lib/flow-parser";
import { api } from "@/lib/api-client";
import { clsx } from "clsx";
import { useShallow } from 'zustand/react/shallow';

import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger, 
    TooltipProvider 
} from "@/components/ui/tooltip";

export const StudioTopbar = memo(function StudioTopbar() {
    const router = useRouter();
    
    // Selectors Estáveis (Só re-renderizam se o valor específico mudar)
    const { flowId, flowName, setFlowMetadata, setFlowName } = useFlowStore(
        useShallow(s => ({ 
            flowId: s.flowId, 
            flowName: s.flowName, 
            setFlowMetadata: s.setFlowMetadata,
            setFlowName: s.setFlowName
        }))
    );
    
    const isDirty = useFlowStore(s => s.isDirty);
    const nodesCount = useFlowStore(s => s.nodes.length);
    const setSaved = useFlowStore(s => s.setSaved);
    const isVariablesDrawerOpen = useFlowStore(s => s.isVariablesDrawerOpen);
    const setVariablesDrawerOpen = useFlowStore(s => s.setVariablesDrawerOpen);
    
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
        const state = useFlowStore.getState();
        if (!state.isDirty && state.flowId) return;

        try {
            setIsSaving(true);
            // Pegamos nodes/edges direto do state para evitar que o Topbar re-renderize a cada drag
            const { nodes, edges, flowName, flowId } = state;
            const backendPayload = parseReactFlowToBackend(nodes, edges, flowName);
            const isUpdate = !!flowId;
            const payload = {
                name: flowName,
                description: "Gerado pelo TrackBot Studio Web",
                jsonContent: { nodes, edges, backendFlow: backendPayload }
            };

            const response = isUpdate 
                ? await api.put(`/flows/${flowId}`, payload)
                : await api.post(`/flows`, payload);

            if (!response.ok) throw new Error("Falha ao salvar no banco");
            const data = await response.json();

            if (!isUpdate && data.id) {
                setFlowMetadata(data.id, data.name, data.description || "");
            }

            setSaved();
            setLastSaved(new Date());
        } catch (error) {
            console.error(error);
            showAlert("Erro ao Salvar", "Não foi possível sincronizar as alterações.", "danger");
        } finally {
            setIsSaving(false);
        }
    }, [setFlowMetadata, setSaved]);

    const handlePublish = async () => {
        const state = useFlowStore.getState();
        if (!state.flowId) return;
        const validation = validateFlow(state.nodes, state.edges);

        if (!validation.isValid) {
            showAlert("Fluxo Inválido", `Existem erros que impedem a publicação:\n\n- ${validation.errors.join('\n- ')}`, "danger");
            return;
        }

        const executePublish = async () => {
            try {
                setIsPublishing(true);
                await handleSave();
                const response = await api.post(`/flows/${state.flowId}/publish`);
                if (!response.ok) throw new Error("Falha ao publicar fluxo");
                showAlert("Sucesso!", "Fluxo publicado com sucesso! O bot já está na nova versão.", "info");
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
            const timer = setTimeout(() => handleSave(), 10000); // 10s auto-save para performance
            return () => clearTimeout(timer);
        }
    }, [isDirty, flowId, handleSave]);

    return (
        <TooltipProvider delayDuration={200}>
            <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 z-20 shadow-sm relative overflow-hidden">
                {/* Visual HUD line - sutil decoration */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

                {/* LEFT: NAVIGATION & INFO */}
                <div className="flex items-center gap-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => router.push('/studio')}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-all border border-border/40 hover:border-border active:scale-95 shadow-sm bg-card/30"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="font-mono text-[10px] uppercase">Back to Flows</TooltipContent>
                    </Tooltip>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={flowName}
                                onChange={(e) => setFlowName(e.target.value)}
                                className="bg-transparent border-none text-[15px] font-bold tracking-tight text-foreground focus:outline-none focus:ring-0 p-0 hover:bg-muted/30 rounded px-1.5 -mx-1.5 transition-colors w-64 uppercase"
                                placeholder="UNNAMED FLOW..."
                            />
                            {isDirty && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 animate-in fade-in zoom-in duration-300">
                                    <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-amber-500 font-mono tracking-widest uppercase opacity-80">Draft</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2.5 text-[9px] text-muted-foreground/60 leading-none mt-1.5 uppercase font-mono tracking-widest font-bold">
                            <span className="flex items-center gap-1">
                                <span className="text-foreground/30">SIZE:</span> {nodesCount} UNITS
                            </span>
                            <span className="opacity-20">•</span>
                            <div className="flex items-center gap-1.5">
                                <CloudIcon className={clsx("w-3 h-3", isSaving ? "animate-pulse text-blue-500" : "opacity-30")} />
                                {isSaving ? (
                                    <span className="text-blue-500">Syncing...</span>
                                ) : lastSaved ? (
                                    <span className="opacity-70">Synced {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                ) : (
                                    "Ready or Syncing"
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TOOLS & ACTIONS (REORGANIZED) */}
                <div className="flex items-center gap-4">
                    {/* TOOLS GROUP */}
                    <div className="flex items-center gap-1.5 mr-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setVariablesDrawerOpen(!isVariablesDrawerOpen)}
                                    className={clsx(
                                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all border shadow-sm active:scale-95",
                                        isVariablesDrawerOpen 
                                            ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                                            : "bg-muted/30 hover:bg-muted/60 text-muted-foreground border-border/40 hover:border-border"
                                    )}
                                >
                                    <Braces className="w-3.5 h-3.5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-mono text-[10px] uppercase">Variable Manager</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => {
                                        const { toggleSimulator, isOpen, startSimulation } = useSimulator.getState();
                                        toggleSimulator();
                                        if (!isOpen) {
                                            startSimulation(useFlowStore.getState().nodes, useFlowStore.getState().edges);
                                        }
                                    }}
                                    className={clsx(
                                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all border shadow-sm active:scale-95 group",
                                        useSimulator().isOpen 
                                            ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                                            : "bg-muted/30 hover:bg-muted/60 text-muted-foreground border-border/40 hover:border-border"
                                    )}
                                >
                                    <Play className={clsx("w-3.5 h-3.5", useSimulator().isOpen ? "fill-red-500" : "fill-muted-foreground/30 group-hover:fill-blue-500 transition-colors")} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-mono text-[10px] uppercase">
                                {useSimulator().isOpen ? "Close Sandbox" : "Open Sandbox"}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="h-6 w-[1px] bg-border/50 mx-1" />

                    {/* ACTIONS GROUP (ICON ONLY) */}
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={clsx(
                                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all border shadow-sm active:scale-95 disabled:opacity-30",
                                        isDirty
                                            ? "bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 border-blue-500/30"
                                            : "bg-muted/20 text-muted-foreground/40 border-border/30"
                                    )}
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className={clsx("w-4 h-4 transition-transform", isDirty && "group-hover:scale-110")} />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-mono text-[10px] uppercase">
                                {isDirty ? "Save Draft" : "All Changes Synced"}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing || !flowId}
                                    className="
                                        group w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white 
                                        rounded-lg transition-all shadow-[0_4px_15px_rgba(37,99,235,0.2)] 
                                        hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] disabled:opacity-40 active:scale-95 
                                        border border-blue-400/20
                                    "
                                >
                                    {isPublishing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Rocket className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> 
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-mono text-[10px] uppercase font-bold text-white bg-blue-600 px-3">
                                Publish Flow to Production
                            </TooltipContent>
                        </Tooltip>
                    </div>
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
        </TooltipProvider>
    );
});

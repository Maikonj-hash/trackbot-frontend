import { PropertyPanelProps } from "./types"
import { useFlowStore } from "@/store/flow-store";
import { Zap, Target, AlertCircle } from "lucide-react";
import { useShallow } from 'zustand/react/shallow';
import { PropertySection, PropertyHint, NodeLabelProperty } from "./base-properties"
import { NODE_REGISTRY } from "@/lib/node-registry";

export function JumpProperties({ node, updateNodeData }: PropertyPanelProps) {
    const nodes = useFlowStore(useShallow(s => s.nodes));

    const availableTargets = nodes
        .filter(n => n.id !== node.id)
        .map(n => {
            const type = n.type || 'unknown';
            const definition = NODE_REGISTRY[type];
            const typeLabel = definition?.label || type || "BLOCO";
            const customName = n.data?.label || "";
            return {
                id: n.id,
                displayLabel: `[${typeLabel.toUpperCase()}] ${customName}`.trim()
            };
        })
        .sort((a, b) => a.displayLabel.localeCompare(b.displayLabel));

    return (
        <div className="space-y-6">
            <NodeLabelProperty node={node} updateNodeData={updateNodeData} />
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-500">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest font-mono">Jump Logic</span>
                </div>
                <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                    Redirecionamento instantâneo via ID de bloco, dispensando conexões visuais no canvas.
                </p>
            </div>

            <PropertySection title="Destino do Salto">
                <div className="space-y-3">
                    <div className="relative group">
                        <select
                            value={node.data.targetStepId || ""}
                            onChange={(e) => updateNodeData(node.id, { targetStepId: e.target.value })}
                            className="w-full bg-background/50 border border-border/60 hover:border-rose-500/50 rounded-lg px-3 py-2.5 text-xs focus:ring-1 focus:ring-rose-500/30 outline-none transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="">Selecione um bloco...</option>
                             {availableTargets.map((target) => (
                                <option key={target.id} value={target.id}>
                                    {target.displayLabel}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                    </div>

                    {!node.data.targetStepId && (
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                            <AlertCircle className="w-3 h-3 text-amber-500" />
                            <span className="text-[10px] text-amber-500/80 font-medium uppercase tracking-tight">Destino obrigatório</span>
                        </div>
                    )}
                </div>
            </PropertySection>

            <div className="pt-4 border-t border-border/50">
                <div className="text-[9px] text-muted-foreground/20 font-mono uppercase tracking-[0.2em] text-center">
                    Jump Module v1.0 // HUD Terminal
                </div>
            </div>
        </div>
    )
}

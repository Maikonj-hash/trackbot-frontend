import { PropertyPanelProps } from "./types"
import { useFlowStore } from "@/store/flow-store";
import { Zap, Target, AlertCircle } from "lucide-react";
import { useShallow } from 'zustand/react/shallow';

export function JumpProperties({ node, updateNodeData }: PropertyPanelProps) {
    const nodes = useFlowStore(useShallow(s => s.nodes));
    
    // Filtra para não permitir saltar para si mesmo ou para blocos inválidos
    const availableTargets = nodes.filter(n => n.id !== node.id);

    return (
        <div className="space-y-6 pt-2">
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-500">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Lógica de Salto</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Este bloco redireciona o fluxo instantaneamente para o destino selecionado, sem a necessidade de conexões visuais (edges).
                </p>
            </div>

            <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 text-rose-400">
                    <Target className="w-3 h-3" />
                    Destino do Salto
                </label>
                
                <div className="relative group">
                    <select
                        value={node.data.targetStepId || ""}
                        onChange={(e) => updateNodeData(node.id, { targetStepId: e.target.value })}
                        className="w-full bg-background border border-border/60 hover:border-rose-500/50 rounded-lg px-3 py-2.5 text-xs focus:ring-1 focus:ring-rose-500/30 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Selecione um bloco...</option>
                        {availableTargets.map((target) => (
                            <option key={target.id} value={target.id}>
                                {target.data?.label || target.type || target.id}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="w-1 h-1 rounded-full bg-rose-500" />
                    </div>
                </div>

                {!node.data.targetStepId && (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/5 border border-amber-500/20 rounded-lg mt-2">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] text-amber-500/80 font-medium">Nenhum destino selecionado</span>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-border/50">
                <div className="text-[9px] text-muted-foreground/40 font-mono uppercase tracking-[0.2em]">
                    Jump Logic v1.0
                </div>
            </div>
        </div>
    )
}

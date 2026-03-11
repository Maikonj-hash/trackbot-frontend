import { PropertyPanelProps } from "./types"
import { Timer, Zap } from "lucide-react"
import { PropertySection, PropertyInput } from "./base-properties"

export function EndProperties({ node, updateNodeData }: PropertyPanelProps) {
    const resetType = node.data.endResetType || "IMMEDIATE";

    return (
        <div className="space-y-6">
            <PropertySection title="Modo de Finalização">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => updateNodeData(node.id, { endResetType: "IMMEDIATE" })}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 ${
                                resetType === "IMMEDIATE" 
                                ? "border-blue-500 bg-blue-500/10 text-blue-400" 
                                : "border-border/40 bg-background/50 text-muted-foreground hover:bg-muted/10"
                            }`}
                        >
                            <Zap className="w-5 h-5" />
                            <span className="text-[10px] font-bold tracking-widest font-mono uppercase">Imediato</span>
                        </button>
                        
                        <button
                            onClick={() => updateNodeData(node.id, { endResetType: "TIMEOUT" })}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 ${
                                resetType === "TIMEOUT" 
                                ? "border-blue-500 bg-blue-500/10 text-blue-400" 
                                : "border-border/40 bg-background/50 text-muted-foreground hover:bg-muted/10"
                            }`}
                        >
                            <Timer className="w-5 h-5" />
                            <span className="text-[10px] font-bold tracking-widest font-mono uppercase">Time-out</span>
                        </button>
                    </div>
                    
                    <p className="text-[9px] text-muted-foreground/50 leading-relaxed font-mono uppercase tracking-tighter text-center">
                        {resetType === "IMMEDIATE" 
                            ? "// Reset instantâneo: fluxo pode recomeçar na próxima interação." 
                            : "// Bloqueia reentrada por tempo definido para evitar loops."
                        }
                    </p>
                </div>
            </PropertySection>

            {resetType === "TIMEOUT" && (
                <PropertySection title="Janela de Expiração">
                    <div className="flex gap-3 items-center">
                        <PropertyInput
                            type="number"
                            value={node.data.endTimeoutValue || 60}
                            onChange={(e) => updateNodeData(node.id, { endTimeoutValue: parseInt(e.target.value) || 0 })}
                            className="w-24 font-mono text-center"
                        />
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Minutos</span>
                    </div>
                </PropertySection>
            )}

            <div className="pt-4 border-t border-border/50 text-center">
                <span className="text-[8px] font-mono text-muted-foreground/20 uppercase tracking-[0.3em]">
                    System Terminal // End_Protocol
                </span>
            </div>
        </div>
    )
}

import { PropertyPanelProps } from "./types"
import { Timer, Zap } from "lucide-react"

export function EndProperties({ node, updateNodeData }: PropertyPanelProps) {
    const resetType = node.data.endResetType || "IMMEDIATE";

    return (
        <div className="space-y-6 pt-2">
            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                    Modo de Finalização
                </label>
                
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        onClick={() => updateNodeData(node.id, { endResetType: "IMMEDIATE" })}
                        className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all gap-2 ${
                            resetType === "IMMEDIATE" 
                            ? "border-foreground bg-foreground/5 text-foreground" 
                            : "border-border bg-transparent text-muted-foreground hover:bg-muted/30"
                        }`}
                    >
                        <Zap className="w-4 h-4" />
                        <span className="text-[9px] font-bold tracking-tight">IMEDIATO</span>
                    </button>
                    
                    <button
                        onClick={() => updateNodeData(node.id, { endResetType: "TIMEOUT" })}
                        className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all gap-2 ${
                            resetType === "TIMEOUT" 
                            ? "border-foreground bg-foreground/5 text-foreground" 
                            : "border-border bg-transparent text-muted-foreground hover:bg-muted/30"
                        }`}
                    >
                        <Timer className="w-4 h-4" />
                        <span className="text-[9px] font-bold tracking-tight">EXPIRAÇÃO</span>
                    </button>
                </div>
                
                <p className="text-[10px] text-muted-foreground/70 leading-relaxed font-mono">
                    {resetType === "IMMEDIATE" 
                        ? "// Reset instantâneo após saída." 
                        : "// Bloqueia reentrada por tempo definido."
                    }
                </p>
            </div>

            {resetType === "TIMEOUT" && (
                <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                            Janela de Expiração
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                value={node.data.endTimeoutValue || 60}
                                onChange={(e) => updateNodeData(node.id, { endTimeoutValue: parseInt(e.target.value) || 0 })}
                                className="w-20 rounded border border-input bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">minutos</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

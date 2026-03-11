import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput } from "./base-properties"

export function DelayProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <PropertySection title="Controle de Latência">
                <div className="space-y-2">
                    <PropertyInput
                        type="number"
                        value={node.data.delayMs || 3000}
                        onChange={(e) => updateNodeData(node.id, { delayMs: parseInt(e.target.value) || 0 })}
                        placeholder="Ex: 3000 (3 Segundos)"
                        className="font-mono text-blue-400"
                    />
                    <p className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter px-1">
                        // Tempo em Milissegundos (1s = 1000)
                    </p>
                </div>
            </PropertySection>

            <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-mono uppercase tracking-tighter">
                    ℹ️ O bot simulará o estado "digitando..." durante este período para maior realismo.
                </p>
            </div>
        </div>
    )
}

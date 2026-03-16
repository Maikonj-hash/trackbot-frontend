import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput, NodeLabelProperty } from "./base-properties"

export function HandoverProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <NodeLabelProperty node={node} updateNodeData={updateNodeData} />
            <PropertySection title="Transbordo Humano">
                <div className="space-y-2">
                    <PropertyInput
                        value={node.data.content as string || ""}
                        onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                        placeholder="Ex: Departamento de Vendas"
                    />
                    <p className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter px-1">
                        // Opcional: Definir departamento de destino
                    </p>
                </div>
            </PropertySection>

            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                <p className="text-[10px] text-orange-500/70 leading-relaxed font-mono uppercase tracking-tighter">
                    ⚠️ Este bloco encerra a automação e notifica os agentes disponíveis no painel.
                </p>
            </div>
        </div>
    )
}

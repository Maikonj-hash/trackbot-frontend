import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput } from "./base-properties"
import { sanitizeVariableName } from "@/lib/node-registry"

export function VariableProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <PropertySection title="Identificação da Variável">
                <div className="space-y-2">
                    <PropertyInput
                        value={node.data.variableName || ""}
                        onChange={(e) => updateNodeData(node.id, { variableName: sanitizeVariableName(e.target.value) })}
                        placeholder="Ex: contador_leads"
                        className="font-mono text-blue-400"
                    />
                    <p className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter px-1">
                        // Nome interno para armazenamento
                    </p>
                </div>
            </PropertySection>

            <PropertySection title="Operação de Lógica">
                <div className="space-y-4">
                    <select
                        value={node.data.variableAction || "SET"}
                        onChange={(e) => updateNodeData(node.id, { variableAction: e.target.value as any })}
                        className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none font-medium"
                    >
                        <option value="SET">Atribuir Novo Valor (=)</option>
                        <option value="INCREMENT">Incrementar (+)</option>
                        <option value="DECREMENT">Decrementar (-)</option>
                    </select>

                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Valor ou Expressão</span>
                        <PropertyInput
                            value={String(node.data.variableValue || "")}
                            onChange={(e) => updateNodeData(node.id, { variableValue: e.target.value })}
                            placeholder="Ex: 5 ou 'Ativo'"
                            className="font-mono"
                        />
                    </div>
                </div>
            </PropertySection>
        </div>
    )
}

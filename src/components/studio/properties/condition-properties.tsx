import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput, NodeLabelProperty } from "./base-properties"

export function ConditionProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <NodeLabelProperty node={node} updateNodeData={updateNodeData} />
            <PropertySection title="Variável de Teste">
                <PropertyInput
                    value={node.data.conditionVariable || ""}
                    onChange={(e) => updateNodeData(node.id, { conditionVariable: e.target.value })}
                    placeholder="Ex: user.name"
                    className="font-mono"
                />
            </PropertySection>

            <PropertySection title="Regra de Comparação">
                <div className="space-y-4">
                    <select
                        value={node.data.conditionOperator || "EQUALS"}
                        onChange={(e) => updateNodeData(node.id, { conditionOperator: e.target.value as any })}
                        className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none font-medium"
                    >
                        <option value="EQUALS">Igual a (=)</option>
                        <option value="NOT_EQUALS">Diferente de (!=)</option>
                        <option value="CONTAINS">Contém</option>
                        <option value="IS_EMPTY">Está Vazio</option>
                        <option value="IS_NOT_EMPTY">Não Está Vazio</option>
                    </select>

                    <PropertyInput
                        value={String(node.data.conditionValue || "")}
                        onChange={(e) => updateNodeData(node.id, { conditionValue: e.target.value })}
                        placeholder="Valor esperado"
                        className="font-mono text-blue-400/80"
                    />
                </div>
            </PropertySection>

            <div className="px-3 py-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                <p className="text-[10px] text-muted-foreground leading-relaxed font-mono uppercase tracking-tighter">
                    // O roteamento seguirá os pinos [TRUE] ou [FALSE]
                </p>
            </div>
        </div>
    )
}

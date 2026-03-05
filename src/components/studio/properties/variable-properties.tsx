import { PropertyPanelProps } from "./types"

export function VariableProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-4 pt-2">
            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Nome da Variável
                </label>
                <input
                    type="text"
                    value={node.data.variableName || ""}
                    onChange={(e) => updateNodeData(node.id, { variableName: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                    placeholder="Ex: score"
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Ação
                </label>
                <select
                    value={node.data.variableAction || "SET"}
                    onChange={(e) => updateNodeData(node.id, { variableAction: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                    <option value="SET">Atribuir Novo Valor (=)</option>
                    <option value="INCREMENT">Incrementar (+)</option>
                    <option value="DECREMENT">Decrementar (-)</option>
                </select>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Valor
                </label>
                <input
                    type="text"
                    value={node.data.variableValue || ""}
                    onChange={(e) => updateNodeData(node.id, { variableValue: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                    placeholder="Ex: 5 ou 'Ativo'"
                />
            </div>
        </div>
    )
}

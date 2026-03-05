import { PropertyPanelProps } from "./types"

export function ConditionProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-4 pt-2">
            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Variável para Testar
                </label>
                <input
                    type="text"
                    value={node.data.conditionVariable || ""}
                    onChange={(e) => updateNodeData(node.id, { conditionVariable: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono"
                    placeholder="Ex: user.name"
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Operador
                </label>
                <select
                    value={node.data.conditionOperator || "EQUALS"}
                    onChange={(e) => updateNodeData(node.id, { conditionOperator: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                    <option value="EQUALS">Igual a (=)</option>
                    <option value="NOT_EQUALS">Diferente de (!=)</option>
                    <option value="CONTAINS">Contém</option>
                    <option value="IS_EMPTY">Está Vazio</option>
                    <option value="IS_NOT_EMPTY">Não Está Vazio</option>
                </select>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Valor
                </label>
                <input
                    type="text"
                    value={String(node.data.conditionValue || "")}
                    onChange={(e) => updateNodeData(node.id, { conditionValue: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono"
                    placeholder="Ex: João"
                />
                <p className="text-[10px] text-muted-foreground pt-1">
                    O roteamento vai pro caminho "Verdadeiro" ou "Falso".
                </p>
            </div>
        </div>
    )
}

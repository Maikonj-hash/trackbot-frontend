import { PropertyPanelProps } from "./types"

export function InputProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Texto da Pergunta
                </label>
                <textarea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="O que o bot deve perguntar?"
                />
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Salvar resposta na variável
                </label>
                <input
                    type="text"
                    value={node.data.variableName || ""}
                    onChange={(e) => updateNodeData(node.id, { variableName: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono"
                    placeholder="Ex: nome_cliente"
                />
                <p className="text-[10px] text-muted-foreground">
                    O que o usuário digitar será salvo com este nome para uso futuro.
                </p>
            </div>
        </div>
    )
}

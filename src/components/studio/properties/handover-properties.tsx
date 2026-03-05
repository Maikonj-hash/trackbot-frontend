import { PropertyPanelProps } from "./types"

export function HandoverProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Departamento Comercial (Opcional)
            </label>
            <input
                type="text"
                value={node.data.content as string || ""}
                onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Ex: Vendas"
            />
        </div>
    )
}

import { PropertyPanelProps } from "./types"

export function DelayProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tempo de Pausa (Em Milissegundos)
            </label>
            <input
                type="number"
                value={node.data.delayMs || 3000}
                onChange={(e) => updateNodeData(node.id, { delayMs: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Ex: 3000 (3 Segundos)"
            />
            <p className="text-[10px] text-muted-foreground">Ex: 1000 = 1 segundo de tempo digitando.</p>
        </div>
    )
}

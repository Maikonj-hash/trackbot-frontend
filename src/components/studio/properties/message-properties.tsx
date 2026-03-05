import { PropertyPanelProps } from "./types"

export function MessageProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Texto da Mensagem
            </label>
            <textarea
                value={node.data.content as string || ""}
                onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="O que o bot deve falar?"
            />
        </div>
    )
}

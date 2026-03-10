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
            <div className="space-y-3 pt-4 border-t border-border/50">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                        Habilitar Botão Voltar (Undo)
                    </span>
                    <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-border">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={node.data.allowBack || false}
                            onChange={(e) => updateNodeData(node.id, { allowBack: e.target.checked })}
                        />
                        <span
                            className={`${node.data.allowBack ? 'translate-x-4 bg-blue-500' : 'translate-x-1 bg-muted-foreground'
                                } inline-block h-3 w-3 transform rounded-full transition-all duration-200 ease-in-out`}
                        />
                    </div>
                </label>
                <p className="text-[10px] text-muted-foreground">
                    Permite que o cliente digite "0" para voltar ao passo anterior.
                </p>
            </div>
        </div>
    )
}

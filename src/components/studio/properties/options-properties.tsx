import { PropertyPanelProps } from "./types"
import { PlusCircle, X } from "lucide-react"

export function OptionsProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-4 pt-2">
            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Texto da Mensagem
                </label>
                <textarea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="O que o bot deve perguntar?"
                />
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Botões de Opções
                    </label>
                    <button
                        onClick={() => {
                            const currentOptions = node.data.options || [];
                            updateNodeData(node.id, { options: [...currentOptions, `Opção ${currentOptions.length + 1}`] });
                        }}
                        className="text-blue-500 hover:text-blue-400 p-1"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-2">
                    {(node.data.options || ["Sim", "Não"]).map((opt, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                        const newOptions = [...(node.data.options || ["Sim", "Não"])];
                                        newOptions[index] = e.target.value;
                                        updateNodeData(node.id, { options: newOptions });
                                    }}
                                    className={`w-full rounded-md border bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${node.data.useNativeButtons && (opt.length > 24) ? 'border-destructive' : 'border-input'}`}
                                />
                                <button
                                    onClick={() => {
                                        const newOptions = [...(node.data.options || ["Sim", "Não"])];
                                        newOptions.splice(index, 1);
                                        updateNodeData(node.id, { options: newOptions });
                                    }}
                                    className="text-muted-foreground hover:text-destructive p-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {node.data.useNativeButtons && opt.length > 20 && (
                                <p className={`text-[9px] ${opt.length > 24 ? 'text-destructive font-bold' : 'text-amber-500'}`}>
                                    {opt.length > 24 ? '❌ Limite ultrapassado (Máx 24)' : '⚠️ Recomendado: Máx 20 para botões'}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-border/10">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                            Usar Botões Nativos (WhatsApp)
                        </span>
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-border">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={node.data.useNativeButtons || false}
                                onChange={(e) => updateNodeData(node.id, { useNativeButtons: e.target.checked })}
                            />
                            <span
                                className={`${node.data.useNativeButtons ? 'translate-x-4 bg-emerald-500' : 'translate-x-1 bg-muted-foreground'
                                    } inline-block h-3 w-3 transform rounded-full transition-all duration-200 ease-in-out`}
                            />
                        </div>
                    </label>
                    <p className="text-[10px] text-muted-foreground pb-2">
                        Envia botões reais (até 3) ou lista automática (até 10).
                    </p>

                    {node.data.useNativeButtons && (
                        <div className="space-y-3">
                            {(node.data.options?.length || 0) > 3 && (node.data.options?.length || 0) <= 10 && (
                                <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] text-blue-400">
                                    ℹ️ <strong>Modo Lista</strong> ativado (mais de 3 opções).
                                </div>
                            )}
                            {(node.data.options?.length || 0) > 10 && (
                                <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] text-amber-400">
                                    ⚠️ <strong>Limite excedido</strong>. O WhatsApp suporta no máximo 10 itens. O robô usará texto comum.
                                </div>
                            )}

                            <div className="space-y-3 p-3 bg-muted/20 rounded-lg border border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Título do Menu</label>
                                        <span className={`text-[9px] ${(node.data.listTitle?.length || 0) > 24 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                            {(node.data.listTitle?.length || 0)}/24
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={node.data.listTitle || ""}
                                        onChange={(e) => updateNodeData(node.id, { listTitle: e.target.value })}
                                        className={`w-full rounded-md border bg-background px-2 py-1 text-xs ${(node.data.listTitle?.length || 0) > 24 ? 'border-destructive' : 'border-input'}`}
                                        placeholder="Ex: Escolha um serviço"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Texto do Botão (Lista)</label>
                                        <span className={`text-[9px] ${(node.data.listButtonLabel?.length || 0) > 20 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                            {(node.data.listButtonLabel?.length || 0)}/20
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={node.data.listButtonLabel || ""}
                                        onChange={(e) => updateNodeData(node.id, { listButtonLabel: e.target.value })}
                                        className={`w-full rounded-md border bg-background px-2 py-1 text-xs ${(node.data.listButtonLabel?.length || 0) > 20 ? 'border-destructive' : 'border-input'}`}
                                        placeholder="Ex: Ver Opções"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Rodapé</label>
                                        <span className={`text-[9px] ${(node.data.listFooter?.length || 0) > 72 ? 'text-amber-500 font-bold' : 'text-muted-foreground'}`}>
                                            {(node.data.listFooter?.length || 0)}/72
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={node.data.listFooter || ""}
                                        onChange={(e) => updateNodeData(node.id, { listFooter: e.target.value })}
                                        className={`w-full rounded-md border bg-background px-2 py-1 text-xs ${(node.data.listFooter?.length || 0) > 72 ? 'border-amber-500' : 'border-input'}`}
                                        placeholder="Ex: Selecione para continuar"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

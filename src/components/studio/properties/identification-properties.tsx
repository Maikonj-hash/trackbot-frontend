import { PropertyPanelProps } from "./types"
import { PlusCircle, X, Info } from "lucide-react"

export function IdentificationProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6 pt-2">
            {/* --- CONFIGURAÇÕES GLOBAIS --- */}
            <div className="space-y-3 pb-4 border-b border-border/50">
                <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="space-y-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-500 transition-colors">
                                Salto Inteligente (Skip)
                            </span>
                            <p className="text-[10px] text-muted-foreground/70 leading-tight">Pular se dados já existirem</p>
                        </div>
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted transition-colors border border-border">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={node.data.skipIfAlreadyFilled || false}
                                onChange={(e) => updateNodeData(node.id, { skipIfAlreadyFilled: e.target.checked })}
                            />
                            <span
                                className={`${node.data.skipIfAlreadyFilled ? 'translate-x-4 bg-emerald-500' : 'translate-x-1 bg-muted-foreground'
                                    } inline-block h-3 w-3 transform rounded-full transition-all duration-200 ease-in-out`}
                            />
                        </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="space-y-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-blue-500 transition-colors">
                                Botão Voltar (Undo)
                            </span>
                            <p className="text-[10px] text-muted-foreground/70 leading-tight">Permitir retornar ao passo anterior</p>
                        </div>
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted transition-colors border border-border">
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
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Mensagem de Identificação
                </label>
                <textarea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Olá! Para começarmos, identifique-se por favor:"
                />
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Dados do Cliente
                    </label>
                    <button
                        onClick={() => {
                            const currentFields = node.data.identificationFields || [];
                            updateNodeData(node.id, {
                                identificationFields: [...currentFields, { label: "Novo Campo", type: "TEXT", saveToVariable: `campo_${Date.now()}` }]
                            });
                        }}
                        className="text-blue-500 hover:text-blue-400 p-1 transition-colors bg-blue-500/10 rounded-md"
                        title="Adicionar Campo"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {(node.data.identificationFields || []).map((field, index: number) => (
                        <div key={index} className="p-3 bg-muted/20 rounded-md border border-border space-y-2 relative group shadow-sm">
                            <button
                                onClick={() => {
                                    const newFields = [...(node.data.identificationFields || [])];
                                    newFields.splice(index, 1);
                                    updateNodeData(node.id, { identificationFields: newFields });
                                }}
                                className="absolute -top-2 -right-2 bg-background border border-border p-1 rounded-full text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground/70">Rótulo da Pergunta</label>
                                <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => {
                                        const newFields = [...(node.data.identificationFields || [])];
                                        newFields[index] = { ...newFields[index], label: e.target.value };
                                        updateNodeData(node.id, { identificationFields: newFields });
                                    }}
                                    className="w-full bg-background border border-input rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
                                    placeholder="Ex: Qual seu nome?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-muted-foreground/70">Tipo</label>
                                    <select
                                        value={field.type}
                                        onChange={(e) => {
                                            const newFields = [...(node.data.identificationFields || [])];
                                            newFields[index] = { ...newFields[index], type: e.target.value as any };
                                            updateNodeData(node.id, { identificationFields: newFields });
                                        }}
                                        className="w-full bg-background border border-input rounded px-1 py-1 text-[10px] focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
                                    >
                                        <option value="TEXT">Texto</option>
                                        <option value="EMAIL">E-mail</option>
                                        <option value="PHONE">Telefone</option>
                                        <option value="CPF">CPF</option>
                                        <option value="NUMBER">Número</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-muted-foreground/70">Variável</label>
                                    <input
                                        type="text"
                                        value={field.saveToVariable}
                                        onChange={(e) => {
                                            const cleanValue = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                            const newFields = [...(node.data.identificationFields || [])];
                                            newFields[index] = { ...newFields[index], saveToVariable: cleanValue };
                                            updateNodeData(node.id, { identificationFields: newFields });
                                        }}
                                        className="w-full bg-background border border-input rounded px-2 py-1 text-[10px] font-mono focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
                                        placeholder="nome_usuario"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {(node.data.identificationFields?.length || 0) === 0 && (
                        <p className="text-[10px] text-muted-foreground text-center py-2 italic bg-muted/10 rounded border border-dashed border-border">
                            Adicione os campos que deseja solicitar ao cliente.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

import { PropertyPanelProps } from "./types"
import { PlusCircle, X, Info } from "lucide-react"
import { PropertySection, PropertyToggle, PropertyInput } from "./base-properties"

export function IdentificationProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <PropertySection title="Configurações Globais">
                <PropertyToggle
                    label="Salto Inteligente (Skip)"
                    description="Ignorar estas perguntas se os dados já estiverem preenchidos no CRM."
                    checked={!!node.data.skipIfAlreadyFilled}
                    onChange={(checked) => updateNodeData(node.id, { skipIfAlreadyFilled: checked })}
                />
            </PropertySection>

            <PropertySection title="Ações do Cliente">
                <PropertyToggle
                    label="Habilitar Voltar (Undo)"
                    description="Permitir que o cliente retorne ao passo anterior digitando '0'."
                    checked={!!node.data.allowBack}
                    onChange={(checked) => updateNodeData(node.id, { allowBack: checked })}
                />
            </PropertySection>

            <PropertySection title="Mensagem de Boas-Vindas">
                <PropertyInput
                    isTextArea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    placeholder="Olá! Para começarmos, identifique-se por favor:"
                />
            </PropertySection>

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

                    <div className="mt-4 p-3 border border-border/40 flex gap-2 bg-muted/5">
                        <Info className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Promoção de Identidade</p>
                            <p className="text-[9px] text-muted-foreground/70 leading-relaxed italic">
                                Use as variáveis <span className="font-mono font-bold">wpp_name</span> e <span className="font-mono font-bold">wpp_phone</span> para atualizar automaticamente o cadastro real do cliente no sistema.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
